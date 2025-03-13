import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../users/entities/user.entity';
import { Investment } from 'src/investments/entities/investment.entity';

@Injectable()
export class InvestOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Investment)
    private investmentRepository: Repository<Investment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const investId = +request.params.id;

    if (!user) {
      return false;
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const investment = await this.investmentRepository.findOne({
      where: { id: investId },
      relations: ['user'],
    });

    if (!investment) {
      return false;
    }

    return investment.investor.id === user.id;
  }
}