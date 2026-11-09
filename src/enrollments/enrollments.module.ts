import { Module } from '@nestjs/common';
import { EnrollmentsController } from './controller/enrollments.controller';
import { EnrollmentsService } from './service/enrollments.service';
import { InMemoryEnrollmentsRepository } from './model/repository/in-memory-enrollments.repository';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, InMemoryEnrollmentsRepository],
})
export class EnrollmentsModule {}
