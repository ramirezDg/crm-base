import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesUser } from './entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModulesUser])],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
