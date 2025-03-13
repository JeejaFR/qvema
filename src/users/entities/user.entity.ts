import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Interest } from '../../interests/entities/interest.entity';
import { Project } from '../../projects/entities/project.entity';
import { Investment } from 'src/investments/entities/investment.entity';

export enum UserRole {
  ENTREPRENEUR = 'Entrepreneur',
  INVESTISSEUR = 'Investisseur',
  ADMIN = 'Admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ENTREPRENEUR,
  })
  role: UserRole;

  @ManyToMany(() => Interest, (interest) => interest.users)
  @JoinTable()
  interests: Interest[];

  @OneToMany(() => Investment, (investment) => investment.investor)
  investments: Investment[];

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
}