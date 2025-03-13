import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';
import { Project } from '../projects/entities/project.entity';
import { Investment } from '../investments/entities/investment.entity';

@Injectable()
export class FixturesService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(Investment)
    private investmentRepository: Repository<Investment>,
  ) {}

  async loadFixtures() {
    // Drop et recrée la base de données
    await this.dataSource.synchronize(true);

    // 1. Ajouter des centres d’intérêt
    const interests = await this.interestRepository.save([
      { name: 'Programmation' },
      { name: 'Design' },
      { name: 'Musique' },
      { name: 'Sport' },
    ]);

    // 2. Utilisateurs avec email et password (obligatoire pour éviter l'erreur)
    const users = await this.userRepository.save([
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: 'password123',
        role: UserRole.ENTREPRENEUR,
        interests: [interests[0], interests[2]],
      },
      {
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie.curie@example.com',
        password: 'password123',
        role: UserRole.INVESTISSEUR,
        interests: [interests[1]],
      },
      {
        firstName: 'Paul',
        lastName: 'Martin',
        email: 'paul.martin@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
        interests: [interests[3]],
      },
    ]);

    // 3. Projets
    const projects = await this.projectRepository.save([
      { title: 'Application Mobile', user: users[0] },
      { title: 'Site Web', user: users[0] },
    ]);

    // 4. Investissements
    await this.investmentRepository.save([
      { amount: 5000, date: new Date('2025-03-01'), investor: users[1], project: projects[0] },
      { amount: 3000, date: new Date('2025-03-02'), investor: users[1], project: projects[1] },
    ]);

    console.log('Fixtures loaded successfully!');
  }
}
