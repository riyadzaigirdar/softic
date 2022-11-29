import * as ulid from 'ulid';
import { v4 as uuid } from 'uuid';
import { AbstractEntity } from 'src/common/constants/entities';
import { Column, Entity, BeforeInsert, OneToMany } from 'typeorm';

import { UserRoleEnum } from 'src/common/constants/enums';
import { Post } from 'src/modules/post/entities/post.entity';

@Entity('user')
export class User extends AbstractEntity {
  @Column({
    type: 'varchar',
    nullable: true,
  })
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  profilePicture: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'enum', enum: UserRoleEnum, nullable: false })
  role: UserRoleEnum;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  emailVerifyHash: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActivity: Date;

  @BeforeInsert()
  userIdGenerate() {
    this.userId = ulid.ulid();

    this.emailVerifyHash = uuid();
  }

  // VIRTUAL COLUMN STARTS
  @OneToMany((type) => Post, (post) => post.user)
  posts: Post[];
}
