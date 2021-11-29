import { Module } from '@nestjs/common';
import { AwsSnsService } from './aws-sns.service';
import { AwsSnsController } from './aws-sns.controller';

@Module({
  controllers: [AwsSnsController],
  providers: [AwsSnsService],
})
export class AwsSnsModule {}
