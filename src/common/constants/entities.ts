import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // generate current date and time
  currentDateTime: Date = new Date();

  @BeforeInsert()
  beforeInsert() {
    this.createdAt = this.currentDateTime;
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = this.currentDateTime;
  }
}
