import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { ChristmasDrawService } from './christmas-draw.service';

@Controller('christmas-draw')
export class ChristmasDrawController {
  constructor(private readonly christmasDrawService: ChristmasDrawService) {}

  @Get('my-recipient')
  @UseGuards(AuthGuard)
  getMyRecipient(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.sub as number;
    return this.christmasDrawService.getMyRecipient(userId);
  }

  @Get(':year/export')
  @UseGuards(AdminGuard)
  export(@Param('year', ParseIntPipe) year: number) {
    return this.christmasDrawService.exportDraw(year);
  }

  @Post(':year/reveal')
  @UseGuards(AdminGuard)
  reveal(@Param('year', ParseIntPipe) year: number) {
    return this.christmasDrawService.revealDraw(year);
  }

  @Get('get-reveal-status')
  @UseGuards(AuthGuard)
  getRevealStatus() {
    return this.christmasDrawService.getRevealStatus();
  }

  // DEV USED
  @Delete(':year')
  reset(@Param('year', ParseIntPipe) year: number) {
    return this.christmasDrawService.resetDraw(year);
  }

  @Get('/my-giftcode')
  @UseGuards(AuthGuard)
  getMyGiftCode(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.sub as number;
    return this.christmasDrawService.checkGiftCode(userId);
  }
}
