## 项目配置

- .env
- ConfigModule - @nestjs/config
  - ConfigService
  - 加载 .env 文件

## 自定义配置文件

```typescript
export default () => ({
    port: process.env.PORT
    ...
})
```

## 使用
```typescript
constructor(private configService: ConfigService) {}
const dbUser = this.configService.get<string>('DATABASE_USER','默认值');
// 通过自定义配置文件
const dbConfig = this.configService.get<DatabaseConfig>('database');

```

[详情查看文档](https://docs.nestjs.com/techniques/configuration#using-the-configservice)