import { Module } from '@nestjs/common';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AppController } from './app.controller';

@Module({
  imports: [EnrollmentsModule],
  controllers: [AppController],
})
export class AppModule {}
