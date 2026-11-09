import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentsService } from '../service/enrollments.service';
import type { Enrollment } from '../model/entity/enrollment';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post()
  create(@Body() input: CreateEnrollmentDto): Enrollment {
    return this.service.create(input.studentId, input.courseId);
  }

  @Get()
  findAll(): Enrollment[] {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string): Enrollment {
    return this.service.findById(id);
  }
}
