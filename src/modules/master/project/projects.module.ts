import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterProjectsService } from './providers/projects.service';
import { MasterProjectsController } from './controllers/projects.controller';
import { MasterProject } from './entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MasterProject])],
  controllers: [MasterProjectsController],
  providers: [MasterProjectsService],
  exports: [MasterProjectsService],
})
export class MasterProjectsModule { }
