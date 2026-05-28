import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectActivitiesService } from './providers/project-activities.service';
import { ProjectActivitiesController } from './controllers/project-activities.controller';
import { ProjectActivity } from './entities/project-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectActivity])],
  controllers: [ProjectActivitiesController],
  providers: [ProjectActivitiesService],
  exports: [ProjectActivitiesService],
})
export class ProjectActivitiesModule { }
