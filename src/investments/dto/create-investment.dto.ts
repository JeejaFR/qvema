import { IsNumber, IsDateString } from 'class-validator';

export class CreateInvestmentDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsNumber()
  investorId: number;

  @IsNumber()
  projectId: number;
}