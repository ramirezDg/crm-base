import { Module } from '@nestjs/common';
import { EntityDefinitionsService } from './entity-definitions.service';
import { EntityDefinitionsController } from './entity-definitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityDefinition } from './entities/entity-definition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityDefinition])],
  controllers: [EntityDefinitionsController],
  providers: [EntityDefinitionsService],
})
export class EntityDefinitionsModule {}
