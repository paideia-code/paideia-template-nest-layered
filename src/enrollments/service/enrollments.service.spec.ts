import { ConflictException, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { EnrollmentsService } from './enrollments.service';
import { InMemoryEnrollmentsRepository } from '../model/repository/in-memory-enrollments.repository';

describe('EnrollmentsService', () => {
  const studentId = 'fe4c8135-ea41-44f6-acaa-bb3f631af36a';
  const courseId = '4773031f-b05e-4adb-9da6-a64ee55713da';
  const now = '2026-11-08T12:00:00.000Z';

  let repository: InMemoryEnrollmentsRepository;
  let service: EnrollmentsService;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(now));

    repository = new InMemoryEnrollmentsRepository();
    service = new EnrollmentsService(repository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('crea una inscripción con identificador y fecha generados', () => {
    jest.spyOn(repository, 'exists').mockReturnValue(false);
    jest.spyOn(repository, 'save').mockImplementation((enrollment) => enrollment);

    const result = service.create(studentId, courseId);

    expect(isUUID(result.id)).toBe(true);
    expect(result).toEqual({
      id: result.id,
      studentId,
      courseId,
      createdAt: now,
    });
  });

  it('rechaza una inscripción duplicada sin guardarla', () => {
    jest.spyOn(repository, 'exists').mockReturnValue(true);
    const save = jest.spyOn(repository, 'save');

    expect(() => service.create(studentId, courseId)).toThrow(ConflictException);
    expect(save).not.toHaveBeenCalled();
  });

  it('informa cuando una inscripción no existe', () => {
    jest.spyOn(repository, 'findById').mockReturnValue(undefined);

    expect(() => service.findById('dd6fd2b5-dff7-4d23-8cba-a729a97ecff2')).toThrow(NotFoundException);
  });
});
