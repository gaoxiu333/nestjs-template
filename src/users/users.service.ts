import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 创建用户
  async create(dto: CreateUserDto): Promise<any> {
    return this.prisma.user.create({
      data: {
        ...dto,
        username: dto.username,
        password: dto.password,
        email: dto.email,
        role: 'ADMIN',
      },
    });
  }
  // 更新用户
  async update(id: string, dto: UserDto): Promise<any> {
    this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }
  // 查询用户
  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany();
  }
  // 根据id查询用户
  async findById(id: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  // 根据邮箱查询用户
  async findByEmail(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  // 根据用户名查询用户
  async findByUsername(username: string): Promise<any> {
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
  // 更新用户密码
  async changePassword(
    id: string,
    password: string,
    changePassword: ChangePasswordDto,
  ): Promise<any> {
    const passwordIsCorrect = await this.validatePassword(
      changePassword,
      password,
    );
    if (!passwordIsCorrect) {
      throw new BadRequestException('密码错误');
    }
    this.prisma.user.update({
      where: { id },
      data: {
        password: changePassword.newPassword,
      },
    });
  }

  // validatePassword
  async validatePassword(
    changePassword: ChangePasswordDto,
    password: any,
  ): Promise<boolean> {
    return changePassword.oldPassword === password;
  }
}
