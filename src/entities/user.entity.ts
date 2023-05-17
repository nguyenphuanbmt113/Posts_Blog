import * as bcryptjs from 'bcryptjs';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { UserRoles } from 'src/modules/auth/role.enum';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: null, nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    enumName: 'roles',
    default: [UserRoles.Reader],
    array: true,
  })
  roles: UserRoles;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  hashPass() {
    this.password = bcryptjs.hashSync(this.password, 10);
  }

  @OneToMany(() => Like, (like) => like.user, {
    nullable: true,
  })
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    nullable: true,
  })
  comments: Comment[];
}
