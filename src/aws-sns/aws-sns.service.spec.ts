import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mockClient } from 'aws-sdk-client-mock';
import {
  SNSClient,
  SubscribeCommand,
  PublishCommand,
} from '@aws-sdk/client-sns';
import { AwsSnsService } from './aws-sns.service';

const snsMock = mockClient(SNSClient);

describe('AwsSnsService', () => {
  let testingModule: TestingModule;
  let service: AwsSnsService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [AwsSnsService, ConfigService],
    }).compile();

    service = testingModule.get<AwsSnsService>(AwsSnsService);
    snsMock.reset();
  });

  afterEach(async () => {
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SNS Mocking Test', () => {
    it('should return object containing topic and url properties', async () => {
      snsMock.on(SubscribeCommand).resolves({
        SubscriptionArn: 'pending confirmation',
      });
      expect(
        await service.subscribe('topic1', 'http://google.com'),
      ).toStrictEqual({
        topic: 'topic1',
        url: 'http://google.com',
      });
    });

    it('should return a string containing MessageId', async () => {
      snsMock.on(PublishCommand).resolves({
        MessageId: '12345678-1111-2222-3333-111122223333',
      });
      expect(await service.publish('topic1', 'Hello World')).toStrictEqual(
        '12345678-1111-2222-3333-111122223333',
      );
    });
  });
});
