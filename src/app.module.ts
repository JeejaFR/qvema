import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { InterestsModule } from './interests/interests.module';
import { ProjectsModule } from './projects/projects.module';
import { FixturesService } from './fixtures/fixtures.service';
import { InvestmentsModule } from './investments/investments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'investor_user',
      password: process.env.DB_PASSWORD || 'mysecurepassword',
      database: process.env.DB_NAME || 'investor_platform',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    InterestsModule,
    ProjectsModule,
    InvestmentsModule,
  ],
})

export class AppModule {}