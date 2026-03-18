import { Request } from 'express';
import { Department } from 'src/constants/user';

export interface UserRequest extends Request {
  user: {
    sub: number;
    email: string;
    dept: Department;
  };
}
