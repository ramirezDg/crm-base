import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogsService } from '../activity-logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActivityLog } from '../entities/activity-log.entity';
import { Users } from '../../users/entities/user.entity';

const mockActivityLogRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
};
const mockUserRepository = {
  findOne: jest.fn(),
};

describe('ActivityLogsService', () => {
  let service: ActivityLogsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogsService,
        {
          provide: getRepositoryToken(ActivityLog),
          useValue: mockActivityLogRepository,
        },
        { provide: getRepositoryToken(Users), useValue: mockUserRepository },
      ],
    }).compile();
    service = module.get<ActivityLogsService>(ActivityLogsService);
  });

  describe('create', () => {
    it('should create and save an activity log', async () => {
      const dto = {
        userId: 'user-1',
        entity: 'users',
        entityId: 'entity-1',
        entityAction: 'create',
        userAgent: 'agent',
      };
      const logEntity = { id: 'log-1', ...dto };
      mockActivityLogRepository.create.mockReturnValue(logEntity);
      mockActivityLogRepository.save.mockResolvedValue(logEntity);
      const result = await service.create(dto);
      expect(result).toEqual(logEntity);
      expect(mockActivityLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: dto.userId,
          entity: dto.entity,
          entityId: dto.entityId,
          entityAction: dto.entityAction,
          userAgent: dto.userAgent,
        }),
      );
      expect(mockActivityLogRepository.save).toHaveBeenCalledWith(logEntity);
    });

    it('should return null if userId is missing and not login', async () => {
      const dto = { entity: 'users', entityAction: 'update' };
      const result = await service.create(dto);
      expect(result).toBeNull();
    });

    it('should throw if save fails', async () => {
      const dto = {
        userId: 'user-1',
        entity: 'users',
        entityId: 'entity-1',
        entityAction: 'create',
      };
      const logEntity = { id: 'log-1', ...dto };
      mockActivityLogRepository.create.mockReturnValue(logEntity);
      mockActivityLogRepository.save.mockRejectedValue(new Error('save error'));
      await expect(service.create(dto)).rejects.toThrow('save error');
    });
  });

  describe('findAll', () => {
    it('should return paginated activity logs with relations', async () => {
      const logs = [{ id: 'log-1', userId: 'user-1', entity: 'users' }];
      mockActivityLogRepository.findAndCount.mockResolvedValue([logs, 1]);
      const pagination = { offset: 0, limit: 10 };
      const result = await service.findAll(pagination as any);
      expect(result.results).toEqual(logs);
      expect(result.total).toBe(1);
      expect(mockActivityLogRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['user'],
        skip: 0,
        take: 10,
      });
    });

    it('should return empty if no logs', async () => {
      mockActivityLogRepository.findAndCount.mockResolvedValue([[], 0]);
      const pagination = { offset: 0, limit: 10 };
      const result = await service.findAll(pagination as any);
      expect(result.results).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
