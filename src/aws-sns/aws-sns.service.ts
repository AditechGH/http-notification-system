import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fromIni } from '@aws-sdk/credential-providers';
import {
  SNSClient,
  SubscribeCommand,
  PublishCommand,
} from '@aws-sdk/client-sns';
import { SubscribeResponse } from './interfaces/subscribe.interface';

@Injectable()
export class AwsSnsService {
  constructor(private readonly configService: ConfigService) {}
  private snsConfig = {
    credentials: fromIni({ profile: 'sns_profile' }),
    region: this.configService.get<string>('AWS_REGION'),
  };
  private instance: SNSClient = null;

  /** Initiate SNSClient with configuration */
  private getInstance(): SNSClient {
    if (!this.instance) {
      this.instance = new SNSClient(this.snsConfig);
    }
    return this.instance;
  }

  /**
   * Subscribes an enpoint to a topic
   *
   * @param {string} topic The topic to subscribe to
   * @param {string} url The HTTP endpoint(The subscriber)
   * @returns {Promise<SubscribeResponse>} Promise object containing topic and url properties
   *  or throw an HttpException error
   */
  public async subscribe(
    topic: string,
    url: string,
  ): Promise<SubscribeResponse> {
    const params = {
      Protocol: 'http',
      TopicArn: `${this.configService.get('AWS_ARN')}${topic}`,
      Endpoint: url,
    };
    try {
      await this.getInstance().send(new SubscribeCommand(params));
      return { topic, url };
    } catch (error) {
      throw new HttpException(
        {
          status: error.$metadata.httpStatusCode,
          error: error.name,
        },
        error.$metadata.httpStatusCode,
      );
    }
  }

  /**
   * Publish message(sends http request with payload) to current subscribers of a topic
   *
   * @param {string} topic The topic to publish to
   * @param {any} message The payload of the http request
   * @returns {Promise<string>} Promise string or throw an HttpException error
   */
  public async publish(topic: string, message: any): Promise<string> {
    const params = {
      Message: JSON.stringify(message),
      TopicArn: `${this.configService.get('AWS_ARN')}${topic}`,
    };
    try {
      const publish = await this.getInstance().send(new PublishCommand(params));
      return publish.MessageId;
    } catch (error) {
      throw new HttpException(
        {
          status: error.$metadata.httpStatusCode,
          error: error.name,
        },
        error.$metadata.httpStatusCode,
      );
    }
  }
}
