import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { ActivityLog } from './entities/activity-log.entity';
import { Users } from '../users/entities/user.entity';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(createActivityLogDto: CreateActivityLogDto) {
    let userId = createActivityLogDto.userId;

    if (!userId && createActivityLogDto.entityAction === 'login') {
      const user = await this.userRepository.findOne({
        where: { id: createActivityLogDto.userId },
      });
      userId = user?.id;
    }

    if (!userId) {
      return null;
    }

    const { userId: _, entityAction, entityId, ...rest } = createActivityLogDto;
    const log = this.activityLogRepository.create({
      ...rest,
      userId: userId,
      ...(entityId !== undefined && entityId !== null ? { entityId } : {}),
      ...(entityAction !== undefined && entityAction !== null
        ? { entityAction }
        : {}),
    });
    try {
      const savedLog = await this.activityLogRepository.save(log);
      // log('Log guardado:', savedLog);
      return savedLog;
    } catch (error) {
      console.error('Error al guardar log:', error);
      throw error;
    }
  }

  async findAll(
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<ActivityLog>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.activityLogRepository.findAndCount({
      relations: ['user'],
      skip: offset,
      take: limit,
    });

    return {
      total,
      limit,
      offset,
      results,
    };
  }
}
