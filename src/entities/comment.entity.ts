import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import BaseClassEntity from './base-entity.entity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity({ name: 'comment' })
export class Comment extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @ManyToOne(() => User, (user: User) => user.posts, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Post, (post: Post) => post.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: Post;
}
