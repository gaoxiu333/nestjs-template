## 版本控制
使用 @Version 装饰器即可
```typescript

import { Controller, Get, Version } from '@nestjs/common';

@Controller() // @Controller({ version:['1','2']}) or  version: VERSION_NEUTRAL 所有版本都能用
export class CatsController {
  @Version('1')
  @Get('cats')
  findAllV1(): string {
    return 'This action returns all cats for version 1';
  }

  @Version('2')
  @Get('cats')
  findAllV2(): string {
    return 'This action returns all cats for version 2';
  }
}
```