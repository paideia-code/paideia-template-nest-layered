import { Injectable } from '@nestjs/common';
import type { Enrollment } from '../entity/enrollment';

@Injectable()
export class InMemoryEnrollmentsRepository {
  private readonly items = new Map<string, Enrollment>();

  exists(studentId: string, courseId: string): boolean {
    return Array.from(this.items.values()).some((item) => item.studentId === studentId && item.courseId === courseId);
  }

  save(enrollment: Enrollment): Enrollment {
    this.items.set(enrollment.id, { ...enrollment });
    return { ...enrollment };
  }

  findAll(): Enrollment[] {
    return Array.from(this.items.values(), (item) => ({ ...item }));
  }

  findById(id: string): Enrollment | undefined {
    const item = this.items.get(id);
    return item ? { ...item } : undefined;
  }
}
