import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SendWishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  wish: string;

  @Column({ nullable: true })
  link?: string;

  @Column()
  userId: number;
}
