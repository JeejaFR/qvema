import { IsString, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsNumber()
  userId: number;
}