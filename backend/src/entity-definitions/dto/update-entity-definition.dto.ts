import { PartialType } from '@nestjs/swagger';
import { CreateEntityDefinitionDto } from './create-entity-definition.dto';

export class UpdateEntityDefinitionDto extends PartialType(CreateEntityDefinitionDto) {}
