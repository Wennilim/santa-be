import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from 'src/dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // 员工提交反馈（匿名，JWT 仅用于 uniqueness 检查）
  @Post()
  @UseGuards(AuthGuard)
  submitFeedback(@Req() req: any, @Body() dto: CreateFeedbackDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.sub as number;
    return this.feedbackService.submitFeedback(userId, dto);
  }

  // 检查当前用户是否已提交本年反馈
  @Get('check')
  @UseGuards(AuthGuard)
  checkHasSubmitted(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.sub as number;
    return this.feedbackService.checkHasSubmitted(userId);
  }

  // 管理员查看 Dashboard 统计
  @Get('dashboard')
  @UseGuards(AdminGuard)
  getDashboard(@Query('year') year?: string) {
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.feedbackService.getDashboard(y);
  }

  // DEV USED
  @Delete()
  @UseGuards(AdminGuard)
  resetFeedback(@Query('year') year?: string) {
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.feedbackService.resetFeedback(y);
  }
}
