import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateMyWishlistDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateMyWishlistDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

class WishlistItemDto {
  @IsString()
  @IsNotEmpty()
  wish: string;

  @IsString()
  @IsOptional()
  link?: string;
}

export class CreateSendWishlistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WishlistItemDto)
  items: WishlistItemDto[];
}

export class SubmitGiftDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsBoolean()
  @IsOptional()
  hasSubmitGift?: boolean;
}
