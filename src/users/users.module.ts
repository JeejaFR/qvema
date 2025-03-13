import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';
import { Project } from '../projects/entities/project.entity';
import { Investment } from '../investments/entities/investment.entity';
import { FixturesService } from '../fixtures/fixtures.service';
import { UserOwnerGuard } from '../auth/user-owner.guard';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Interest, Project, Investment]),
  ],
  controllers: [UsersController],
  providers: [UsersService, FixturesService, UserOwnerGuard, AuthGuard],
  exports: [UsersService],
})
export class UsersModule {
  constructor(private readonly fixturesService: FixturesService) {
    this.loadFixtures();
  }

  async loadFixtures() {
    await this.fixturesService.loadFixtures();
  }
}