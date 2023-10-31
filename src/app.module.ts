import { Module } from '@nestjs/common';
import { AppGateway } from './app/app.gateway';
import { App2Gateway } from './app2/app2.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [AppGateway, App2Gateway],
})
export class AppModule {}
