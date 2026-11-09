import type { Enrollment } from '../entity/enrollment';
import { InMemoryEnrollmentsRepository } from './in-memory-enrollments.repository';

describe('InMemoryEnrollmentsRepository', () => {
  const enrollment: Enrollment = {
    id: 'dd6fd2b5-dff7-4d23-8cba-a729a97ecff2',
    studentId: 'fe4c8135-ea41-44f6-acaa-bb3f631af36a',
    courseId: '4773031f-b05e-4adb-9da6-a64ee55713da',
    createdAt: '2026-11-08T12:00:00.000Z',
  };

  let repository: InMemoryEnrollmentsRepository;

  beforeEach(() => {
    repository = new InMemoryEnrollmentsRepository();
  });

  it('comienza vacío', () => {
    expect(repository.findAll()).toEqual([]);
    expect(repository.findById(enrollment.id)).toBeUndefined();
  });

  it('permite recuperar una inscripción guardada', () => {
    repository.save(enrollment);

    expect(repository.findById(enrollment.id)).toEqual(enrollment);
    expect(repository.findAll()).toEqual([enrollment]);
  });

  it('detecta coincidencia únicamente del mismo alumno y curso', () => {
    repository.save(enrollment);

    expect(repository.exists(enrollment.studentId, enrollment.courseId)).toBe(true);

    expect(repository.exists(enrollment.studentId, '056882c9-4664-42f9-acf8-7308073ca396')).toBe(false);

    expect(repository.exists('49f99ce5-e2ca-427e-a681-706c73a19d73', enrollment.courseId)).toBe(false);
  });

  it('conserva los datos aunque cambie el objeto recibido', () => {
    const input = { ...enrollment };

    repository.save(input);
    input.studentId = '49f99ce5-e2ca-427e-a681-706c73a19d73';

    expect(repository.findById(enrollment.id)).toEqual(enrollment);
  });

  it('protege los datos frente a cambios en los objetos devueltos', () => {
    repository.save(enrollment);

    const saved = repository.findById(enrollment.id);

    if (!saved) {
      throw new Error('La inscripción debería existir');
    }

    Object.assign(saved, { studentId: 'modificado' });

    const listed = repository.findAll();
    Object.assign(listed[0], { courseId: 'modificado' });
    listed.pop();

    expect(repository.findById(enrollment.id)).toEqual(enrollment);
    expect(repository.findAll()).toEqual([enrollment]);
  });

  it('mantiene los datos separados entre instancias del repositorio', () => {
    repository.save(enrollment);

    const anotherRepository = new InMemoryEnrollmentsRepository();

    expect(anotherRepository.findAll()).toEqual([]);
    expect(anotherRepository.findById(enrollment.id)).toBeUndefined();
  });
});
