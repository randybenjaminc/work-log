import { IsString, IsDateString, IsNumber, Min, Max, IsOptional, MinLength } from 'class-validator';

export class CreateWorklogDto {
  @IsString()
  @MinLength(5)
  description: string;

  @IsDateString()
  date: string;

  @IsNumber()
  @Min(0.5)
  @Max(24)
  hours: number;

  @IsString()
  @IsOptional()
  project?: string;
}

export class UpdateWorklogDto {
  @IsString()
  @MinLength(5)
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsNumber()
  @Min(0.5)
  @Max(24)
  @IsOptional()
  hours?: number;

  @IsString()
  @IsOptional()
  project?: string;
}