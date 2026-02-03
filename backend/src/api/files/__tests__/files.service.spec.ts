import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../files.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Files } from '../entities/file.entity';
import { Repository } from 'typeorm';

describe('FilesService', () => {
  let service: FilesService;
  let repo: Repository<Files>;

  const fileId = 'f1a2b3c4';
  const fileEntity = {
    id: fileId,
    filename: 'archivo.txt',
    originalName: 'original.txt',
    mimeType: 'text/plain',
    size: 1234,
    path: '/tmp/archivo.txt',
    entityId: 'e1a2b3c4',
    entityType: 'document',
    checksum: 'abc123',
    createdAt: new Date(),
    deletedAt: null,
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
        FilesService,
        {
          provide: getRepositoryToken(Files),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<FilesService>(FilesService);
    repo = module.get<Repository<Files>>(getRepositoryToken(Files));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a file', async () => {
    mockRepo.create.mockReturnValue({ ...fileEntity });
    mockRepo.save.mockResolvedValue(fileEntity);
    const dto = {
      filename: 'archivo.txt',
      originalName: 'original.txt',
      mimeType: 'text/plain',
      size: 1234,
      path: '/tmp/archivo.txt',
      entityId: 'e1a2b3c4',
      entityType: 'document',
      checksum: 'abc123',
    };
    const result = await service.create(dto);
    expect(result).toEqual(fileEntity);
    expect(mockRepo.create).toHaveBeenCalledWith({
      ...dto,
      checksum: '',
    });
    expect(mockRepo.save).toHaveBeenCalledWith({ ...fileEntity });
  });

  it('should return all files', async () => {
    mockRepo.findAndCount.mockResolvedValue([[fileEntity], 1]);
    const pagination = { offset: 0, limit: 10 };
    const result = await service.findAll(pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [fileEntity],
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      where: { deletedAt: expect.any(Object) },
      skip: 0,
      take: 10,
    });
  });

  it('should return one file by id', async () => {
    mockRepo.findOne.mockResolvedValue(fileEntity);
    const result = await service.findOne(fileId);
    expect(result).toEqual(fileEntity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: fileId, deletedAt: expect.any(Object) },
    });
  });

  it('should delete a file', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(fileId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(fileId);
  });
});
