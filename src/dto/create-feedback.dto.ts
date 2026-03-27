import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  overall_satisfaction: number;

  @IsInt()
  @Min(1)
  @Max(5)
  gift_satisfaction_level: number;

  @IsInt()
  @Min(1)
  @Max(5)
  games_activities: number;

  @IsInt()
  @Min(1)
  @Max(5)
  event_catering: number;

  @IsString()
  future_expectation: string;
}
