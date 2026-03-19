import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('event_config')
export class EventConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  max_budget: number;

  @Column({ type: 'date' })
  date_event: Date;

  @Column()
  location: string;

  // ["#E63946", "#2D6A4F", "#FFFFFF"]
  @Column({ type: 'jsonb' })
  costume_color: string[];

  // agenda JSON
  @Column({ type: 'jsonb' })
  agenda: {
    time: {
      hour: number;
      minute: number;
    };
    title: string;
    content: string;
  }[];
}
