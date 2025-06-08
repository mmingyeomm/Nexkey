import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Enterprise } from '../enterprise/enterprise.entity';

export enum AddonType {
  SINGLE = 'single',
  MULTIPLE = 'multiple'
}

@Entity('addons')
export class Addon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AddonType,
    default: AddonType.SINGLE
  })
  type: AddonType;

  @Column({ type: 'timestamp' })
  startingTime: Date;

  @Column({ type: 'int' }) // Duration in minutes
  duration: number;

  @Column({ length: 255, nullable: true })
  contractAddress: string;

  @Column('uuid')
  enterpriseId: string;

  @ManyToOne(() => Enterprise, enterprise => enterprise.addons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enterpriseId' })
  enterprise: Enterprise;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 