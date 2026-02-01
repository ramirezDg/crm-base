import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntity } from './entities/entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BaseEntity])],
  controllers: [EntitiesController],
  providers: [EntitiesService],
})
export class EntitiesModule {}
