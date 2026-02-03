import { Test, TestingModule } from '@nestjs/testing';
import { ErrorLogsService } from '../error-logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ErrorLog } from '../entities/error-log.entity';
import { Repository } from 'typeorm';

describe('ErrorLogsService', () => {
  let service: ErrorLogsService;
  let repo: Repository<ErrorLog>;

  const errorId = 1;
  const errorLogEntity = {
    id: errorId,
    message: 'Error de prueba',
    stack: 'stacktrace',
    type: 'TypeError',
    userId: 123,
    context: { module: 'test' },
    createdAt: new Date(),
  };

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorLogsService,
        {
          provide: getRepositoryToken(ErrorLog),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<ErrorLogsService>(ErrorLogsService);
    repo = module.get<Repository<ErrorLog>>(getRepositoryToken(ErrorLog));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an error log', async () => {
    mockRepo.create.mockReturnValue({ ...errorLogEntity });
    mockRepo.save.mockResolvedValue(errorLogEntity);
    const dto = {
      message: 'Error de prueba',
      stack: 'stacktrace',
      type: 'TypeError',
      userId: 123,
      context: { module: 'test' },
    };
    const result = await service.create(dto);
    expect(result).toEqual(errorLogEntity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...errorLogEntity });
  });

  it('should return all error logs', async () => {
    mockRepo.find.mockResolvedValue([errorLogEntity]);
    const result = await service.findAll();
    expect(result).toEqual([errorLogEntity]);
    expect(mockRepo.find).toHaveBeenCalledWith({
      order: { createdAt: 'DESC' },
    });
  });

  it('should return one error log by id', async () => {
    mockRepo.findOneBy.mockResolvedValue(errorLogEntity);
    const result = await service.findOne(errorId);
    expect(result).toEqual(errorLogEntity);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: errorId });
  });

  it('should update an error log', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOneBy.mockResolvedValue({
      ...errorLogEntity,
      message: 'Actualizado',
    });
    const dto = { message: 'Actualizado' };
    const result = await service.update(errorId, dto);
    expect(result).toEqual({ ...errorLogEntity, message: 'Actualizado' });
    expect(mockRepo.update).toHaveBeenCalledWith(errorId, dto);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: errorId });
  });

  it('should delete an error log', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    await service.remove(errorId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(errorId);
  });
});
