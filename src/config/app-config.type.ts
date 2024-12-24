export type NestConfig = {
  port: number;
  apiPrefix: string;
};
export type CorsConfig = {
  enabled: boolean;
};
export type SwaggerConfig = {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
};
export type SecurityConfig = {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: number | string;
};
export type AppConfig = {
  nodeEnv: string;
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
};
