import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PermissionsDecorator } from '../common/decorators/permissions.decorator';

@Controller('activity-logs')
@UseGuards(PermissionsGuard)
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Post()
  create(@Body() createActivityLogDto: CreateActivityLogDto) {
    return this.activityLogsService.create(createActivityLogDto);
  }

  @Get()
  @PermissionsDecorator('activityLogs.read')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.activityLogsService.findAll(pagination);
  }
}
