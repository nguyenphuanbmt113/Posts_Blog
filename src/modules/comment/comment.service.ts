import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async deleteComment(id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
    });
    await comment.remove();
    return 'remove okela';
  }
}
