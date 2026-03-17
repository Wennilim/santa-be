import { ChristmasDrawResult } from './christmas-draw-result-entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class ChristmasDraw {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  year: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'generated', 'revealed'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  drawDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  revealDate: Date;

  @OneToMany(() => ChristmasDrawResult, (result) => result.draw)
  results: ChristmasDrawResult[];
}
