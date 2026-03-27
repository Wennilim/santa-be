import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from 'src/dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,
  ) {}

  /**
   * Submit feedback — only allowed Dec 26–31, one per user per year.
   */
  async submitFeedback(userId: number, dto: CreateFeedbackDto) {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-based
    const day = now.getDate();

    if (month !== 12 || day < 26 || day > 31) {
      throw new ForbiddenException(
        'Feedback submission is only allowed between December 26 and December 31.',
      );
    }

    const year = now.getFullYear();

    // Check if already submitted
    const existing = await this.feedbackRepo.findOne({
      where: { userId, year },
    });

    if (existing) {
      throw new ConflictException(
        'You have already submitted feedback for this year.',
      );
    }

    const feedback = this.feedbackRepo.create({
      userId,
      year,
      overallSatisfaction: dto.overall_satisfaction,
      giftSatisfaction: dto.gift_satisfaction_level,
      gamesActivities: dto.games_activities,
      eventCatering: dto.event_catering,
      futureExpectations: dto.future_expectation,
    });

    await this.feedbackRepo.save(feedback);

    return { message: 'Feedback submitted successfully.' };
  }

  /**
   * Check if a user has already submitted feedback for the current year.
   */
  async checkHasSubmitted(userId: number) {
    const year = new Date().getFullYear();

    const existing = await this.feedbackRepo.findOne({
      where: { userId, year },
    });

    return { hasSubmitted: !!existing };
  }

  /**
   * Dashboard — returns aggregated anonymous stats for a given year.
   */
  async getDashboard(year: number) {
    const feedbacks = await this.feedbackRepo.find({ where: { year } });

    if (feedbacks.length === 0) {
      return {
        totalResponses: 0,
        overallSatisfactionRatio: { satisfied: 0, dissatisfied: 0 },
        perActivitySatisfaction: [],
        futureExpectations: [],
        averageScore: 0,
      };
    }

    const stats = {
      overall: { satisfied: 0, neutral: 0, dissatisfied: 0 },
      gift: { satisfied: 0, neutral: 0, dissatisfied: 0 },
      games: { satisfied: 0, neutral: 0, dissatisfied: 0 },
      catering: { satisfied: 0, neutral: 0, dissatisfied: 0 },
    };

    const classifyScore = (
      score: number,
      target: { satisfied: number; neutral: number; dissatisfied: number },
    ) => {
      if (score >= 4) target.satisfied++;
      else if (score === 3) target.neutral++;
      else target.dissatisfied++;
    };

    feedbacks.forEach((fb) => {
      classifyScore(fb.overallSatisfaction, stats.overall);
      classifyScore(fb.giftSatisfaction, stats.gift);
      classifyScore(fb.gamesActivities, stats.games);
      classifyScore(fb.eventCatering, stats.catering);
    });

    const perActivitySatisfaction = [
      {
        activity: 'GiftExchange',
        ...stats.gift,
      },
      {
        activity: 'GamesActivities',
        ...stats.games,
      },
      {
        activity: 'EventCatering',
        ...stats.catering,
      },
    ];

    const totalOverallScore = feedbacks.reduce(
      (sum, fb) => sum + fb.overallSatisfaction,
      0,
    );
    const averageScore = parseFloat(
      (totalOverallScore / feedbacks.length).toFixed(2),
    );

    const futureExpectations = feedbacks
      .map((fb) => fb.futureExpectations)
      .filter((text) => text && text.trim().length > 0);

    return {
      totalResponses: feedbacks.length,
      overallSatisfactionRatio: stats.overall,
      perActivitySatisfaction,
      futureExpectations,
      averageScore,
    };
  }

  // ONLY DEV USED [ADMIN]
  async resetFeedback(year: number) {
    await this.feedbackRepo.delete({ year });
    return { message: `Feedback for ${year} reset successfully.` };
  }
}
