import { Test, TestingModule } from '@nestjs/testing';
import { CustomFieldValuesService } from '../custom-field-values.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomFieldValue } from '../entities/custom-field-value.entity';
import { Repository } from 'typeorm';

describe('CustomFieldValuesService', () => {
  let service: CustomFieldValuesService;
  let repo: Repository<CustomFieldValue>;

  const valueId = 'v1a2b3c4';
  const customFieldValueEntity = {
    id: valueId,
    customField: { id: 'f1a2b3c4' },
    entityInstanceId: 'entity-uuid',
    value: 'High',
    createdAt: new Date(),
    updatedAt: new Date(),
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
        CustomFieldValuesService,
        {
          provide: getRepositoryToken(CustomFieldValue),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<CustomFieldValuesService>(CustomFieldValuesService);
    repo = module.get<Repository<CustomFieldValue>>(
      getRepositoryToken(CustomFieldValue),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a custom field value', async () => {
    mockRepo.create.mockReturnValue({ ...customFieldValueEntity });
    mockRepo.save.mockResolvedValue(customFieldValueEntity);
    const dto = {
      customFieldId: 'f1a2b3c4',
      entityInstanceId: 'entity-uuid',
      value: 'High',
    };
    const result = await service.create(dto);
    expect(result).toEqual(customFieldValueEntity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...customFieldValueEntity });
  });

  it('should return all custom field values', async () => {
    mockRepo.findAndCount.mockResolvedValue([[customFieldValueEntity], 1]);
    const pagination = { offset: 0, limit: 10 };
    const result = await service.findAll(pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [customFieldValueEntity],
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      where: { deletedAt: expect.any(Object) },
    });
  });

  it('should return one custom field value by id', async () => {
    mockRepo.findOne.mockResolvedValue(customFieldValueEntity);
    const result = await service.findOne(valueId);
    expect(result).toEqual(customFieldValueEntity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: valueId, deletedAt: expect.any(Object) },
    });
  });

  it('should update a custom field value', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOne.mockResolvedValue({
      ...customFieldValueEntity,
      value: 'Medium',
    });
    const dto = { value: 'Medium' };
    const result = await service.update(valueId, dto);
    expect(result).toEqual({ ...customFieldValueEntity, value: 'Medium' });
    expect(mockRepo.update).toHaveBeenCalledWith(valueId, dto);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: valueId } });
  });

  it('should delete a custom field value', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(valueId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(valueId);
  });
});
