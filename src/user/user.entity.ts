import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  department: string;

  @Column()
  gender: string;

  @Column({ default: false })
  isVerified: boolean; // 默认 false

  @Column({ type: 'varchar', nullable: true }) // <- 这里
  verificationToken: string | null; // 用来存临时验证 token
}
