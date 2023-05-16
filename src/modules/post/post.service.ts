import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}
  async create(createPostDto: CreatePostDto, user: User) {
    const post = new Post();
    post.userId = user.id;
    Object.assign(post, createPostDto);
    this.postRepo.create(createPostDto);
    return await this.postRepo.save(post);
  }

  async findAll(query?: string) {
    const myQuery = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.user', 'user');

    if (!(Object.keys(query).length === 0) && query.constructor === Object) {
      const queryKeys = Object.keys(query);
      // check if slug key is present
      if (queryKeys.includes('slug')) {
        myQuery.where('post.slug LIKE :slug', { slug: `%${query['slug']}%` });
      }
      // check if sort key is present, we will sort by Title field only
      if (queryKeys.includes('sort')) {
        myQuery.orderBy('post.title', query['sort'].toUpperCase());
      }

      // check if category is present, show only selected category items
      if (queryKeys.includes('category')) {
        myQuery.andWhere('category.title = :cat', { cat: query['category'] });
      }
      return await myQuery.getMany();
    } else {
      const posts = await myQuery.getMany();
      return posts;
    }
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);
    return post;
  }

  async findBySlug(slug: string) {
    try {
      const post = await this.postRepo.findOne({
        where: {
          slug,
        },
      });
      return post;
    } catch (err) {
      throw new BadRequestException(`Post with slug ${slug} not found`);
    }
  }

  async update(slug: string, updatePostDto: UpdatePostDto) {
    const post = await this.findBySlug(slug);

    if (!post) {
      throw new BadRequestException('post not found');
    }

    post.modifiedOn = new Date(Date.now());
    post.category = updatePostDto.category;
    Object.assign(post, updatePostDto);
    return this.postRepo.save(post);
  }
}
