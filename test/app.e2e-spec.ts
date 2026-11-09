import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { isUUID } from 'class-validator';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import type { Enrollment } from '../src/enrollments/model/entity/enrollment';

describe('Enrollments HTTP', () => {
  let app: INestApplication<App>;

  const payload = {
    studentId: 'fe4c8135-ea41-44f6-acaa-bb3f631af36a',
    courseId: '4773031f-b05e-4adb-9da6-a64ee55713da',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('responde al chequeo de salud', async () => {
    await request(app.getHttpServer()).get('/health').expect(200).expect({ status: 'ok' });
  });

  it('comienza sin inscripciones', async () => {
    await request(app.getHttpServer()).get('/enrollments').expect(200).expect([]);
  });

  it('crea una inscripción y permite recuperarla', async () => {
    const response = await request(app.getHttpServer()).post('/enrollments').send(payload).expect(201);

    const created = response.body as Enrollment;

    expect(created).toMatchObject(payload);
    expect(isUUID(created.id)).toBe(true);
    expect(Number.isNaN(Date.parse(created.createdAt))).toBe(false);

    await request(app.getHttpServer()).get(`/enrollments/${created.id}`).expect(200).expect(created);

    await request(app.getHttpServer()).get('/enrollments').expect(200).expect([created]);
  });

  it('rechaza duplicados sin crear otra inscripción', async () => {
    await request(app.getHttpServer()).post('/enrollments').send(payload).expect(201);

    await request(app.getHttpServer()).post('/enrollments').send(payload).expect(409);

    const response = await request(app.getHttpServer()).get('/enrollments').expect(200);

    expect(response.body as Enrollment[]).toHaveLength(1);
  });

  const invalidInputs: [string, Record<string, unknown>][] = [
    ['alumno ausente', { courseId: payload.courseId }],
    ['curso ausente', { studentId: payload.studentId }],
    ['UUID inválido', { ...payload, studentId: 'incorrecto' }],
    ['campo desconocido', { ...payload, unexpected: true }],
  ];

  it.each(invalidInputs)('rechaza %s', async (_label, body) => {
    await request(app.getHttpServer()).post('/enrollments').send(body).expect(400);

    await request(app.getHttpServer()).get('/enrollments').expect(200).expect([]);
  });

  it('devuelve 404 para una inscripción inexistente', async () => {
    await request(app.getHttpServer()).get('/enrollments/dd6fd2b5-dff7-4d23-8cba-a729a97ecff2').expect(404);
  });

  it('devuelve 400 cuando el identificador de ruta es inválido', async () => {
    await request(app.getHttpServer()).get('/enrollments/identificador-invalido').expect(400);
  });
});
