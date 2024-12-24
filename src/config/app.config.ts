import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { validateConfig } from '../utils/validate-config';
import { AppConfig } from './app-config.type';
import e from 'express';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_NAME: string;
}

// TODO: 补充类型
export default () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'NestJS App',

    // 语言配置
    nest: {
      port: process.env.NEST_PORT
        ? parseInt(process.env.NEST_PORT, 10)
        : process.env.PORT
          ? parseInt(process.env.PORT, 10)
          : 3000,
      apiPrefix: process.env.API_PREFIX || 'api',
    },
    cors: {
      enabled: true,
    },
    swagger: {
      enabled: true,
      title: 'NestJS App',
      description: 'NestJS App swagger',
      version: '1.0',
      path: 'docs',
    },
    security: {
      expiresIn: '60s',
      refreshIn: '1d',
      bcryptSaltOrRound: 10,
    },
  } as AppConfig;
};
