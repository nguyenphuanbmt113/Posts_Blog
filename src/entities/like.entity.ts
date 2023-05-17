import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import BaseClassEntity from './base-entity.entity';
import { User } from './user.entity';
import { Post } from './post.entity';
export enum Type {
  happy = 'happy',
  sad = 'sad',
  angry = 'angry',
  like = 'like',
}
@Entity('like')
export class Like extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: Type, type: 'enum', default: Type.like })
  type: string;

  @ManyToOne(() => User, (user: User) => user.likes, {})
  @JoinColumn()
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, {})
  @JoinColumn()
  post: Post;
}
