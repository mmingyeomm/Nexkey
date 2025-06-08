import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Addon } from '../addon/addon.entity';

@Entity('enterprises')
export class Enterprise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  walletAddress: string;

  @Column({ length: 500, nullable: true })
  imageUrl: string;

  @OneToMany(() => Addon, addon => addon.enterprise)
  addons: Addon[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 