import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NoAccount } from './auth/decorators/no-account';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @NoAccount(true)
  getHealth(): string {
    return this.appService.getHealth();
  }
}
