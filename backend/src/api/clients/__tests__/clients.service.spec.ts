import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { Repository } from 'typeorm';

describe('ClientsService', () => {
  let service: ClientsService;
  let repo: Repository<Client>;

  const clientId = 'a1b2c3d4';
  const company = { id: '8c6f00cc-d63f-49e5-919e-56c5ec685e62' };
  const role = { id: 'fe7f966f-6a58-44bd-8f92-58633d43416a', name: 'Admin' };

  const clientEntity = {
    id: clientId,
    name: 'Cliente Test',
    email: 'cliente@test.com',
    company,
    role,
  };

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
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
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<ClientsService>(ClientsService);
    repo = module.get<Repository<Client>>(getRepositoryToken(Client));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a client', async () => {
    mockRepo.create.mockReturnValue({ ...clientEntity });
    mockRepo.save.mockResolvedValue(clientEntity);
    const dto = {
      name: 'Cliente Test',
      email: 'cliente@test.com',
      companyId: company.id,
    };
    const result = await service.create(dto);
    expect(result).toEqual(clientEntity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...clientEntity });
  });

  it('should return all clients', async () => {
    mockRepo.findAndCount.mockResolvedValue([[clientEntity], 1]);
    const pagination = { offset: 0, limit: 10 };
    const result = await service.findAll(pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [clientEntity],
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      where: { deletedAt: expect.any(Object) },
      skip: 0,
      take: 10,
    });
  });

  it('should return one client by id', async () => {
    mockRepo.findOne.mockResolvedValue(clientEntity);
    const result = await service.findOne(clientId);
    expect(result).toEqual(clientEntity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: clientId, deletedAt: expect.any(Object) },
    });
  });

  it('should update a client', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOne.mockResolvedValue({
      ...clientEntity,
      name: 'Nuevo Nombre',
    });
    const dto = { name: 'Nuevo Nombre' };
    const result = await service.update(clientId, dto);
    expect(result).toEqual({ ...clientEntity, name: 'Nuevo Nombre' });
    expect(mockRepo.update).toHaveBeenCalledWith(clientId, dto);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: clientId } });
  });

  it('should delete a client', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(clientId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(clientId);
  });
});
