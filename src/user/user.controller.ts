import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user';
import { UserService } from './user.service';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get('/get-all')
  @UseGuards(AdminGuard)
  findAllRealUsers() {
    return this.userService.findAllbyAdmin();
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  findAllUsers() {
    return this.userService.findAllbyUser();
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
