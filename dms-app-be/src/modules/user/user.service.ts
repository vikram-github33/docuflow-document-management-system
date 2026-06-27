import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.userRepository.create({
      ...dto,
      passwordHash: dto.passwordHash,
    });

    return this.userRepository.save(user);
  }

   async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    // console.log("id",id)
    const usersData = await  this.userRepository.findOneBy({ id });
    return usersData
  }

  //   async update(
  //   id: string,
  //   dto: UpdateUserDto,
  // ) {
  //   await this.userRepository.update(id, dto);

  //   return this.findOne(id);
  // }

  async update(id: string, dto: UpdateUserDto) {
  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  Object.assign(user, dto);

  return this.userRepository.save(user);
}
}
