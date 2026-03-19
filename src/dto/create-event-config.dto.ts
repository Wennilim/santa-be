import {
  IsInt,
  IsDateString,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { PartialType } from '@nestjs/mapped-types';

class TimeDto {
  @IsInt()
  hour: number;

  @IsInt()
  minute: number;
}

class AgendaItemDto {
  @ValidateNested()
  @Type(() => TimeDto)
  time: TimeDto;

  @IsString()
  title: string;

  @IsString()
  content: string;
}

export class CreateEventConfigDto {
  @IsInt()
  max_budget: number;

  @IsDateString()
  date_event: string;

  @IsString()
  location: string;

  @IsArray()
  costume_color: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgendaItemDto)
  agenda: AgendaItemDto[];
}

export class UpdateEventConfigDto extends PartialType(CreateEventConfigDto) {}
