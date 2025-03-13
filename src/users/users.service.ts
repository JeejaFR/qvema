import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Interest } from '../interests/entities/interest.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role || UserRole.ENTREPRENEUR,
    });
    if (createUserDto.interestIds) {
      user.interests = await this.interestRepository.findBy({
        id: In(createUserDto.interestIds),
      });
    }
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['interests', 'projects'] });
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['interests', 'projects'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);
    if (user) {
      if (updateUserDto.interestIds) {
        user.interests = await this.interestRepository.findByIds(
          updateUserDto.interestIds,
        );
      }
      Object.assign(user, updateUserDto);
      return this.userRepository.save(user);
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
