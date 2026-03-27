import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('feedback')
@Unique(['userId', 'year'])
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  overallSatisfaction: number;

  @Column({ type: 'int' })
  giftSatisfaction: number;

  @Column({ type: 'int' })
  gamesActivities: number;

  @Column({ type: 'int' })
  eventCatering: number;

  @Column({ type: 'text' })
  futureExpectations: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
