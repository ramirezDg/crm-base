import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from '../sessions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from '../entities/session.entity';
import { Repository } from 'typeorm';

describe('SessionsService', () => {
  let service: SessionsService;
  let repo: Repository<Session>;

  const sessionId = 's1a2b3c4';
  const sessionEntity = {
    id: sessionId,
    user: { id: 'u1' },
    company: { id: 'c1' },
    hashedAt: 'hashed_at',
    hashedRt: 'hashed_rt',
    user_agent: 'agent',
    expires_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getRepositoryToken(Session),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<SessionsService>(SessionsService);
    repo = module.get<Repository<Session>>(getRepositoryToken(Session));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a session', async () => {
    mockRepo.create.mockReturnValue({ ...sessionEntity });
    mockRepo.save.mockResolvedValue(sessionEntity);
    const dto = {
      user: { id: 'u1' },
      company: { id: 'c1' },
      hashedAt: 'hashed_at',
      hashedRt: 'hashed_rt',
      user_agent: 'agent',
      expires_at: new Date(),
    };
    const result = await service.create(dto);
    expect(result).toEqual(sessionEntity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...sessionEntity });
  });

  it('should return all sessions', async () => {
    mockRepo.find.mockResolvedValue([sessionEntity]);
    const result = await service.findAll();
    expect(result).toEqual([sessionEntity]);
    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { created_at: expect.any(Object) },
    });
  });

  it('should return one session by id', async () => {
    mockRepo.findOne.mockResolvedValue(sessionEntity);
    const result = await service.findOne(sessionId);
    expect(result).toEqual(sessionEntity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: sessionId, created_at: expect.any(Object) },
    });
  });

  it('should update a session', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOne.mockResolvedValue({
      ...sessionEntity,
      user_agent: 'updated-agent',
    });
    const dto = { user_agent: 'updated-agent' };
    const result = await service.update(sessionId, dto);
    expect(result).toEqual({ ...sessionEntity, user_agent: 'updated-agent' });
    expect(mockRepo.update).toHaveBeenCalledWith({ id: sessionId }, dto);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: sessionId, created_at: expect.any(Object) },
    });
  });

  it('should delete a session', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(sessionId);
    expect(result).toEqual({ deleted: true });
    expect(mockRepo.softDelete).toHaveBeenCalledWith(sessionId);
  });
});
