import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;
}
