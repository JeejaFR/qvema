import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';
import { Project } from '../projects/entities/project.entity';
import { FixturesService } from '../fixtures/fixtures.service';
import { Investment } from 'src/investments/entities/investment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest, Project, Investment])],
  controllers: [UsersController],
  providers: [UsersService, FixturesService],
})
export class UsersModule {
  constructor(private readonly fixturesService: FixturesService) {
    this.loadFixtures();
  }

  async loadFixtures() {
    await this.fixturesService.loadFixtures();
  }
}