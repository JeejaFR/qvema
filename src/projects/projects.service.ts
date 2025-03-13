import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const user = await this.userRepository.findOneBy({ id: createProjectDto.userId });
    if (!user) {
      throw new Error('User not found');
    }

    const project = this.projectRepository.create({
      title: createProjectDto.title,
      user,
    });
    return this.projectRepository.save(project);
  }

  findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['user', 'investments', 'investments.investor'] });
  }

  findOne(id: number): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['user', 'investments', 'investments.investor'],
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    if (!project) {
      throw new Error('Project not found');
    }

    if (updateProjectDto.userId) {
      const user = await this.userRepository.findOneBy({ id: updateProjectDto.userId });
      if (!user) {
        throw new Error('User not found');
      }
      project.user = user;
    }

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    if (!project) {
      throw new Error('Project not found');
    }
    await this.projectRepository.delete(id);
  }
}