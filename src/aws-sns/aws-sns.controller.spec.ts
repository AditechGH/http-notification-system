import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AwsSnsController } from './aws-sns.controller';
import { AwsSnsService } from './aws-sns.service';

describe('AwsSnsController', () => {
  let testingModule: TestingModule;
  let controller: AwsSnsController;
  let awsSnsService: AwsSnsService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AwsSnsController],
      providers: [AwsSnsService, ConfigService],
    }).compile();

    controller = testingModule.get<AwsSnsController>(AwsSnsController);
    awsSnsService = testingModule.get<AwsSnsService>(AwsSnsService);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('POST /subscribe', () => {
    it('should return an object containing topic and url properties', async () => {
      const data = {
        topic: 'topic1',
        url: 'http://halalclothing.co',
      };

      jest
        .spyOn(awsSnsService, 'subscribe')
        .mockImplementation(async () => data);
      expect(await controller.subscribe(data.topic, data.url)).toBe(data);
    });
  });

  describe('POST /publish', () => {
    it('should return a string representing MessageId', async () => {
      const data = {
        topic: 'topic1',
        message: JSON.stringify({ url: 'http://halalclothing.co' }),
      };
      const result = '12345678-4444-5555-6666-111122223333';

      jest
        .spyOn(awsSnsService, 'publish')
        .mockImplementation(async () => result);
      expect(await controller.publish(data.topic, data.message)).toBe(result);
    });
  });
});
