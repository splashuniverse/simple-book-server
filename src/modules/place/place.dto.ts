import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class EditStatusPlaceDto {
  @IsNotEmpty()
  @IsNumber()
  placeId: number;
}

export class RegisterReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
