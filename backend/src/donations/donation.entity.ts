import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Cause } from '../causes/cause.entity';

@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  donorName: string;

  @Column({ nullable: true })
  donorEmail: string;

  @Column()
  causeId: string;

  @ManyToOne(() => Cause, (cause) => cause.donations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'causeId' })
  cause: Cause;

  @CreateDateColumn()
  createdAt: Date;
}
