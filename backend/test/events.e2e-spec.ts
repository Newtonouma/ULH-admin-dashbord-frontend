import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../src/events/event.entity';

describe('EventsController (e2e)', () => {
  let app: INestApplication;

  const testEvent = {
    title: 'Test Event',
    shortDescription: 'Test Description',
    category: 'Test Category',
    description: 'Full Test Description',
    imageUrl: 'test.jpg',
    time: '10:00',
    date: '2024-03-20',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdEventId: number;

  describe('POST /events', () => {
    it('should create a new event', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send(testEvent)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(testEvent.title);
          createdEventId = res.body.id;
        });
    });
  });

  describe('GET /events', () => {
    it('should return an array of events', () => {
      return request(app.getHttpServer())
        .get('/events')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /events/:id', () => {
    it('should return a single event', () => {
      return request(app.getHttpServer())
        .get(`/events/${createdEventId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdEventId);
          expect(res.body.title).toBe(testEvent.title);
        });
    });

    it('should return 404 for non-existent event', () => {
      return request(app.getHttpServer()).get('/events/99999').expect(404);
    });
  });

  describe('PATCH /events/:id', () => {
    it('should update an event', () => {
      const updateData = { title: 'Updated Title' };
      return request(app.getHttpServer())
        .patch(`/events/${createdEventId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdEventId);
          expect(res.body.title).toBe(updateData.title);
        });
    });

    it('should return 404 when updating non-existent event', () => {
      return request(app.getHttpServer())
        .patch('/events/99999')
        .send({ title: 'New Title' })
        .expect(404);
    });
  });

  describe('DELETE /events/:id', () => {
    it('should delete an event', () => {
      return request(app.getHttpServer())
        .delete(`/events/${createdEventId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existent event', () => {
      return request(app.getHttpServer()).delete('/events/99999').expect(404);
    });
  });
});
