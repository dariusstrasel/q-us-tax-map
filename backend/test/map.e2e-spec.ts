import request from 'supertest';
import jest from 'jest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Map API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /api/map/data returns map data', async () => {
    const res = await request(app.getHttpServer()).get('/api/map/data');
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
  });

  afterAll(async () => {
    await app.close();
  });
});