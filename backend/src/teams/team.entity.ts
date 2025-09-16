import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  @Column({ nullable: true })
  contact?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ nullable: true })
  tiktok?: string;

  @Column({ nullable: true })
  twitter?: string; // For X (formerly Twitter)

  @Column({ nullable: true })
  linkedin?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
