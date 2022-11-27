import * as ulid from 'ulid';
import { AbstractEntity } from 'src/common/constants/entities';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('post')
export class Post extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: false })
  body: string;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne((type) => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  user: User;
}
