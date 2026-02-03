import { Test, TestingModule } from '@nestjs/testing';
import { CustomFieldsService } from '../custom-fields.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomField } from '../entities/custom-field.entity';
import { Repository } from 'typeorm';

describe('CustomFieldsService', () => {
  let service: CustomFieldsService;
  let repo: Repository<CustomField>;

  const fieldId = 'f1a2b3c4';
  const customFieldEntity = {
    id: fieldId,
    name: 'Priority',
    type: 'string',
    entityType: 'task',
    isRequired: true,
    options: ['High', 'Medium', 'Low'],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    values: [],
    entityDefinition: null,
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
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomFieldsService,
        {
          provide: getRepositoryToken(CustomField),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<CustomFieldsService>(CustomFieldsService);
    repo = module.get<Repository<CustomField>>(getRepositoryToken(CustomField));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a custom field', async () => {
    mockRepo.create.mockReturnValue({ ...customFieldEntity });
    mockRepo.save.mockResolvedValue(customFieldEntity);
    const dto = {
      name: 'Priority',
      type: 'string',
      entityType: 'task',
      isRequired: true,
      options: ['High', 'Medium', 'Low'],
    };
    const result = await service.create(dto);
    expect(result).toEqual(customFieldEntity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...customFieldEntity });
  });

  it('should return all custom fields', async () => {
    mockRepo.findAndCount.mockResolvedValue([[customFieldEntity], 1]);
    const pagination = { offset: 0, limit: 10 };
    const result = await service.findAll(pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [customFieldEntity],
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      relations: ['values'],
      where: { deletedAt: expect.any(Object) },
    });
  });

  it('should return one custom field by id', async () => {
    mockRepo.findOne.mockResolvedValue(customFieldEntity);
    const result = await service.findOne(fieldId);
    expect(result).toEqual(customFieldEntity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: fieldId, deletedAt: expect.any(Object) },
      relations: ['values'],
    });
  });

  it('should update a custom field', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOne.mockResolvedValue({
      ...customFieldEntity,
      name: 'Urgency',
      isRequired: false,
    });
    const dto = { name: 'Urgency', isRequired: false };
    const result = await service.update(fieldId, dto);
    expect(result).toEqual({
      ...customFieldEntity,
      name: 'Urgency',
      isRequired: false,
    });
    expect(mockRepo.update).toHaveBeenCalledWith(fieldId, dto);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: fieldId } });
  });

  it('should delete a custom field', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(fieldId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(fieldId);
  });
});
