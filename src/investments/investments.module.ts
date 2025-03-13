import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { Investment } from './entities/investment.entity';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { InvestOwnerGuard } from 'src/auth/invest-owner.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Investment, User, Project])],
  controllers: [InvestmentsController],
  providers: [InvestmentsService, InvestOwnerGuard, AuthGuard],
})
export class InvestmentsModule {}