import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 创建用户
  async create(data: CreateUserDto): Promise<any> {
    this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        role: 'ADMIN',
      },
    });
  }
  // 更新用户
  async update(id: string, data: UserDto): Promise<any> {
    this.prisma.user.update({
      where: { id },
      data: {
        username: data.username,
        password: data.password,
      },
    });
  }
  // 查询用户
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  // 根据id查询用户
  async findById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  // 根据用户名查询用户
  async findByUsername(username: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
  // 删除用户
  async delete(id: string): Promise<any> {
    this.prisma.user.delete({
      where: { id },
    });
  }
}
