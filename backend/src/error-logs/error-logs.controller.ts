import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ErrorLogsService } from './error-logs.service';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { UpdateErrorLogDto } from './dto/update-error-log.dto';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PermissionsDecorator } from '../common/decorators';

@Controller('error-logs')
@UseGuards(PermissionsGuard)
export class ErrorLogsController {
  constructor(private readonly errorLogsService: ErrorLogsService) {}

  @Post()
  create(@Body() createErrorLogDto: CreateErrorLogDto) {
    return this.errorLogsService.create(createErrorLogDto);
  }

  @Get()
  @PermissionsDecorator('errorLogs.read')
  findAll() {
    return this.errorLogsService.findAll();
  }

  @Get(':id')
  @PermissionsDecorator('errorLogs.read')
  findOne(@Param('id') id: string) {
    return this.errorLogsService.findOne(+id);
  }

  @Patch(':id')
  @PermissionsDecorator('errorLogs.update')
  update(
    @Param('id') id: string,
    @Body() updateErrorLogDto: UpdateErrorLogDto,
  ) {
    return this.errorLogsService.update(+id, updateErrorLogDto);
  }

  @Delete(':id')
  @PermissionsDecorator('errorLogs.delete')
  remove(@Param('id') id: string) {
    return this.errorLogsService.remove(+id);
  }
}
