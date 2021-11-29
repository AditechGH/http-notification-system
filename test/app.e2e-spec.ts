import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AwsSnsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST subscribe', () => {
    it('/ valid @Param(topic) and valid @Body(url)', async () => {
      const resp = await request(app.getHttpServer())
        .post('/subscribe/topic1')
        .send({ url: 'http://google.com' });
      expect(resp.status).toBe(201);
      expect(resp.body.topic).toBe('topic1');
      expect(resp.body.url).toBe('http://google.com');
    });

    it('/ invalid @Param(topic): no topic', async () => {
      const resp = await request(app.getHttpServer())
        .post('/subscribe/')
        .send({ url: 'http://google.com' });
      expect(resp.status).toBe(404);
      expect(resp.body.error).toBe('Not Found');
    });

    it('/ invalid @Param(topic): unregistered topic', async () => {
      const resp = await request(app.getHttpServer())
        .post('/subscribe/topic3')
        .send({ url: 'http://google.com' });
      expect(resp.status).toBe(404);
      expect(resp.body.error).toBe('NotFound');
    });

    it('/ invalid @Body(url): no URL', async () => {
      const resp = await request(app.getHttpServer())
        .post('/subscribe/topic1')
        .send({ url: '' });
      expect(resp.status).toBe(400);
      expect(resp.body.error).toBe('InvalidParameter');
    });

    it('/ invalid @Body(url): unregistered URL', async () => {
      const resp = await request(app.getHttpServer())
        .post('/subscribe/topic1')
        .send({ url: 'http://vialung.com' });
      expect(resp.status).toBe(400);
      expect(resp.body.error).toBe('InvalidParameter');
    });
  });

  describe('POST publish', () => {
    it('/ @Body(message) as string', async () => {
      const resp = await request(app.getHttpServer())
        .post('/publish/topic1')
        .send({ message: 'http://google.com' });
      expect(resp.status).toBe(200);
      expect(resp.body).toBeTruthy();
    });

    it('/ @Body(message) as object', async () => {
      const resp = await request(app.getHttpServer())
        .post('/publish/topic1')
        .send({ message: { URL: 'http://google.com' } });
      expect(resp.status).toBe(200);
      expect(resp.body).toBeTruthy();
    });

    it('/ invalid @Param(topic): no topic', async () => {
      const resp = await request(app.getHttpServer())
        .post('/publish/')
        .send({ message: { URL: 'http://google.com' } });
      expect(resp.status).toBe(404);
      expect(resp.body.error).toBe('Not Found');
    });

    it('/ invalid @Param(topic): unregistered topic', async () => {
      const resp = await request(app.getHttpServer())
        .post('/publish/topic3')
        .send({ message: { URL: 'http://google.com' } });
      expect(resp.status).toBe(404);
      expect(resp.body.error).toBe('NotFound');
    });

    it('/ invalid @Body(message): no message', async () => {
      const resp = await request(app.getHttpServer())
        .post('/publish/topic1')
        .send({});
      expect(resp.status).toBe(400);
      expect(resp.body.error).toBe('ValidationError');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
