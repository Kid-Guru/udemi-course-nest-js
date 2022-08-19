import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { connection } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as request from 'supertest';
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from '../src/auth/auth.constants';
import { AppModule } from '../src/app.module';

const loginDto: AuthDto = { login: 'a@a.ru', password: '1' };

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - fail password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '2' })
      .expect(401, {
        statusCode: 401,
        message: WRONG_PASSWORD_ERROR,
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - fail login', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'aaaa@aaaa.ru' })
      .expect(401, {
        statusCode: 401,
        message: USER_NOT_FOUND_ERROR,
        error: 'Unauthorized',
      });
  });

  afterAll(() => {
    connection.close();
  });
});
