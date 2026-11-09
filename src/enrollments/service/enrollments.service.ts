import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Enrollment } from '../model/entity/enrollment';
import { InMemoryEnrollmentsRepository } from '../model/repository/in-memory-enrollments.repository';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly repository: InMemoryEnrollmentsRepository) {}

  create(studentId: string, courseId: string): Enrollment {
    if (this.repository.exists(studentId, courseId)) {
      throw new ConflictException('El alumno ya está inscrito en este curso');
    }

    return this.repository.save({
      id: randomUUID(),
      studentId,
      courseId,
      createdAt: new Date().toISOString(),
    });
  }

  findAll(): Enrollment[] {
    return this.repository.findAll();
  }

  findById(id: string): Enrollment {
    const enrollment = this.repository.findById(id);

    if (!enrollment) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    return enrollment;
  }
}
