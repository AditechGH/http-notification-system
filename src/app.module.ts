import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AwsSnsModule } from './aws-sns/aws-sns.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AwsSnsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
