import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Body,
  Req,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ChristmasDrawService } from './christmas-draw.service';

@Controller('christmas-draw')
@UseGuards(AuthGuard)
export class ChristmasDrawController {
  constructor(private readonly christmasDrawService: ChristmasDrawService) {}

  @Get('my-recipient')
  getMyRecipient(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.sub as number;
    return this.christmasDrawService.getMyRecipient(userId);
  }

  @Get(':year/export')
  export(@Param('year', ParseIntPipe) year: number) {
    return this.christmasDrawService.exportDraw(year);
  }

  @Post(':year/reveal')
  reveal(@Param('year', ParseIntPipe) year: number) {
    return this.christmasDrawService.revealDraw(year);
  }

  @Get('get-reveal-status')
  getRevealStatus() {
    return this.christmasDrawService.getRevealStatus();
  }

  @Delete(':year')
  reset(@Param('year', ParseIntPipe) year: number) {
    return this.christmasDrawService.resetDraw(year);
  }
}
