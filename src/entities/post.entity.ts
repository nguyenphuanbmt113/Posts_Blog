import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';
import slugify from 'slugify';
import { Category } from './category.entity';
import BaseClassEntity from './base-entity.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
@Entity('posts')
export class Post extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  slug: string;

  @Column({ default: 3 })
  @Exclude()
  categoryId: number;

  @Column()
  @Exclude()
  userId: number;

  @ManyToOne(() => Category, (cat) => cat.posts, { eager: true })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'categoryId',
  })
  category: Category;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'userId',
  })
  user: User;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedOn: Date;

  @Column({
    default:
      'https://i0.wp.com/clicxy.com/wp-content/uploads/2016/04/dummy-post-horisontal.jpg?ssl=1',
    nullable: true,
  })
  mainImageUrl: string;

  @BeforeInsert()
  slugifyPost() {
    this.slug = slugify(this.title.substr(0, 20), {
      replacement: '_',
      lower: true,
    });
  }

  @OneToMany(() => Comment, (comment: Comment) => comment.post, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @OneToMany(() => Like, (like: Like) => like.post, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  likes: Like[];
}
