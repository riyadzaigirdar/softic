import * as ulid from 'ulid';
import { AbstractEntity } from 'src/common/constants/entities';
import { Column, Entity, BeforeInsert } from 'typeorm';

import { UserRoleEnum } from 'src/common/constants/enums';

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

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'enum', enum: UserRoleEnum, nullable: false })
  role: UserRoleEnum;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActivity: Date;

  @BeforeInsert()
  userIdGenerate() {
    this.userId = ulid.ulid();
  }
}
