import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
/**
 * Product can have multiple other attributes
 * like category, tags, reviews etc
 * they are better when implemented as realation so not implementing them
 * for the scope of this project
 */
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  sku: number;

  @Column({ type: 'varchar', length: 800, nullable: true })
  imageUrl: string;

  @VersionColumn()
  version: number;
}
