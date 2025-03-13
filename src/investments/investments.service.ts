import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentRepository: Repository<Investment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto): Promise<Investment> {
    const investor = await this.userRepository.findOneBy({
      id: createInvestmentDto.investorId,
    });
    const project = await this.projectRepository.findOneBy({
      id: createInvestmentDto.projectId,
    });

    if (!investor || !project) {
      throw new Error('Investor or Project not found');
    }

    const investment = this.investmentRepository.create({
      amount: createInvestmentDto.amount,
      date: new Date(createInvestmentDto.date),
      investor,
      project,
    });
    return this.investmentRepository.save(investment);
  }

  findAll(): Promise<Investment[]> {
    return this.investmentRepository.find({
      relations: ['investor', 'project'],
    });
  }

  findOne(id: number): Promise<Investment | null> {
    return this.investmentRepository.findOne({
      where: { id },
      relations: ['investor', 'project'],
    });
  }

  async update(
    id: number,
    updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<Investment | null> {
    const investment = await this.findOne(id);
    if (investment) {
      if (updateInvestmentDto.investorId) {
        const investor = await this.userRepository.findOneBy({
          id: updateInvestmentDto.investorId,
        });
        if (investor) {
          investment.investor = investor;
        }
      }
      if (updateInvestmentDto.projectId) {
        const projet = await this.projectRepository.findOneBy({
          id: updateInvestmentDto.projectId,
        });
        if (projet) {
          investment.project = projet;
        }
      }
      Object.assign(investment, updateInvestmentDto);
      return this.investmentRepository.save(investment);
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    await this.investmentRepository.delete(id);
  }
}
