import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Department, Gender } from 'src/constants/user';

export class CreateUserDto {
  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Department)
  department: Department;

  @IsEnum(Gender)
  gender: Gender;
}
