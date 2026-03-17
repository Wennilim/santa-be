import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChristmasDraw } from './christmas-draw-entity';
import { User } from '../user/user.entity';
@Entity()
export class ChristmasDrawResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChristmasDraw, (draw) => draw.results)
  draw: ChristmasDraw;

  @ManyToOne(() => User)
  giver: User;

  @ManyToOne(() => User)
  receiver: User;
}
