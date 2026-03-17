import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  department: string;

  @Column()
  gender: string;

  @Column({ default: false })
  isVerified: boolean; // 默认 false

  @Column({ type: 'varchar', nullable: true, select: false }) // <- 这里
  verificationToken: string | null; // 用来存临时验证 token

  @Column({ type: 'varchar', nullable: true, select: false })
  otp: string | null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  otpExpiresAt: Date | null;

  @Column({ type: 'simple-json', nullable: true })
  wishlist: any[] | null;
}
