import { Body, Controller, Param, Post, HttpCode } from '@nestjs/common';
import { AwsSnsService } from './aws-sns.service';
import { SubscribeResponse } from './interfaces/subscribe.interface';

@Controller()
export class AwsSnsController {
  constructor(private readonly awsSnsService: AwsSnsService) {}

  @Post('/subscribe/:topic')
  async subscribe(
    @Param('topic') topic: string,
    @Body('url') url: string,
  ): Promise<SubscribeResponse> {
    return await this.awsSnsService.subscribe(topic, url);
  }

  @Post('/publish/:topic')
  @HttpCode(200)
  async publish(
    @Param('topic') topic: string,
    @Body('message') message: any,
  ): Promise<string> {
    return await this.awsSnsService.publish(topic, message);
  }
}
