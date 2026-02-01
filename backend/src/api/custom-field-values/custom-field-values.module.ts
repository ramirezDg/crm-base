import { Module } from '@nestjs/common';
import { CustomFieldValuesService } from './custom-field-values.service';
import { CustomFieldValuesController } from './custom-field-values.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomFieldValue } from './entities/custom-field-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomFieldValue])],
  controllers: [CustomFieldValuesController],
  providers: [CustomFieldValuesService],
})
export class CustomFieldValuesModule {}
