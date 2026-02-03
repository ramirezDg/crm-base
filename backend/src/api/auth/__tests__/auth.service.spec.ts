import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from '../../users/users.service';
import { SessionsService } from '../../sessions/sessions.service';
import { RolePermission } from '../../role-permissions/entities/role-permission.entity';

const mockUsersService = {
  findOneByEmail: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
};
const mockJwtService = {
  signAsync: jest.fn(),
};
const mockConfigService = {
  get: jest.fn(),
};
const mockSessionsService = {
  create: jest.fn(),
  remove: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};
const mockRolePermissionRepository = {
  find: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(bcryptjs, 'hash').mockImplementation(async (v) => `hashed_${v}`);
    jest
      .spyOn(bcryptjs, 'compare')
      .mockImplementation(async (a, b) => a === b || b === `hashed_${a}`);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: SessionsService, useValue: mockSessionsService },
        {
          provide: getRepositoryToken(RolePermission),
          useValue: mockRolePermissionRepository,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user and create session', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(undefined);
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: 'test@mail.com',
      });
      mockJwtService.signAsync
        .mockResolvedValueOnce('access')
        .mockResolvedValueOnce('refresh');
      mockSessionsService.create.mockResolvedValue({});
      mockConfigService.get.mockReturnValue('secret');

      const result = await service.register({
        name: 'Test',
        lastName: 'User',
        email: 'test@mail.com',
        password: '123456',
      });
      expect(result).toHaveProperty('accessToken', 'access');
      expect(result).toHaveProperty('refreshToken', 'refresh');
      expect(mockUsersService.create).toHaveBeenCalled();
      expect(mockSessionsService.create).toHaveBeenCalled();
    });
    it('should throw if email exists', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({ id: '1' });
      await expect(
        service.register({
          name: 'Test',
          lastName: 'User',
          email: 'test@mail.com',
          password: '123456',
        }),
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login and create session', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({
        id: '1',
        email: 'test@mail.com',
        password: 'hashed_123456',
        role: { id: 'fe7f966f-6a58-44bd-8f92-58633d43416a', name: 'Admin' },
        company: { id: '8c6f00cc-d63f-49e5-919e-56c5ec685e62' },
        name: 'Test',
        lastName: 'User',
      });
      mockRolePermissionRepository.find.mockResolvedValue([
        { permission: { key: 'users.read' } },
      ]);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');
      mockSessionsService.create.mockResolvedValue({});
      mockConfigService.get.mockReturnValue('secret');

      const result = await service.login({
        email: 'test@mail.com',
        password: '123456',
      });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockSessionsService.create).toHaveBeenCalled();
    });
    it('should throw if user not found', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(undefined);
      await expect(
        service.login({ email: 'notfound@mail.com', password: '123456' }),
      ).rejects.toThrow();
    });
    it('should throw if password is invalid', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({
        id: '1',
        email: 'test@mail.com',
        password: 'hashed_abcdef',
        role: { id: 'r1' },
        company: { id: 'c1' },
        name: 'Test',
        lastName: 'User',
      });
      await expect(
        service.login({ email: 'test@mail.com', password: 'wrongpass' }),
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should call sessionsService.remove', async () => {
      mockSessionsService.remove.mockResolvedValue(true);
      const result = await service.logout('1');
      expect(result).toBe(true);
      expect(mockSessionsService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('refresh', () => {
    it('should refresh tokens if valid', async () => {
      mockSessionsService.findOne.mockResolvedValue({
        id: '1',
        hashedRt: 'hashed_refresh',
        user: '1',
      });
      mockUsersService.findOne.mockResolvedValue({
        id: '1',
        email: 'test@mail.com',
      });
      mockJwtService.signAsync.mockResolvedValue('token');
      mockSessionsService.update.mockResolvedValue({});
      mockConfigService.get.mockReturnValue('secret');
      jest
        .spyOn(bcryptjs, 'compare')
        .mockImplementation(async () => true as any);
      const result = await service.refresh('1', 'refresh');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockSessionsService.update).toHaveBeenCalled();
    });
    it('should throw if session or hashedRt not found', async () => {
      mockSessionsService.findOne.mockResolvedValue(undefined);
      await expect(service.refresh('1', 'refresh')).rejects.toThrow();
    });
    it('should throw if refresh token is invalid', async () => {
      mockSessionsService.findOne.mockResolvedValue({
        id: '1',
        hashedRt: 'hashed_refresh',
      });
      jest
        .spyOn(bcryptjs, 'compare')
        .mockImplementation(async () => false as any);
      await expect(service.refresh('1', 'refresh')).rejects.toThrow();
    });
  });

  // Additional tests for AuthService

  describe('getTokens', () => {
    it('should generate access and refresh tokens', async () => {
      mockJwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');
      mockConfigService.get.mockReturnValue('jwt_secret');
      const service: AuthService = new AuthService(
        mockUsersService as any,
        mockJwtService as any,
        mockConfigService as any,
        mockRolePermissionRepository as any,
        mockSessionsService as any,
      );
      const tokens = await service.getTokens('userId', 'user@mail.com');
      expect(tokens).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        hasrefreshToken: 'true',
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('register', () => {
    it('should hash password before creating user', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(undefined);
      mockUsersService.create.mockResolvedValue({
        id: '2',
        email: 'new@mail.com',
      });
      mockJwtService.signAsync
        .mockResolvedValueOnce('access')
        .mockResolvedValueOnce('refresh');
      mockSessionsService.create.mockResolvedValue({});
      mockConfigService.get.mockReturnValue('secret');
      const result = await service.register({
        name: 'New',
        lastName: 'User',
        email: 'new@mail.com',
        password: 'pass123',
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.stringContaining('hashed_'),
        }),
      );
      expect(result).toHaveProperty('accessToken', 'access');
      expect(result).toHaveProperty('refreshToken', 'refresh');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user has no role', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({
        id: '1',
        email: 'test@mail.com',
        password: 'hashed_123456',
        company: { id: 'c1' },
        name: 'Test',
        lastName: 'User',
      });
      await expect(
        service.login({ email: 'test@mail.com', password: '123456' }),
      ).rejects.toThrow();
    });

    it('should return correct payload', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({
        id: '1',
        email: 'test@mail.com',
        password: 'hashed_123456',
        role: { id: 'r1' },
        company: { id: 'c1' },
        name: 'Test',
        lastName: 'User',
      });
      mockRolePermissionRepository.find.mockResolvedValue([
        { permission: { key: 'users.read' } },
        { permission: { key: 'users.write' } },
      ]);
      mockJwtService.signAsync.mockResolvedValue('token');
      mockConfigService.get.mockReturnValue('secret');
      const result = await service.login({
        email: 'test@mail.com',
        password: '123456',
      });
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken', 'token');
      expect(result).toHaveProperty('sub', '1');
      expect(result).toHaveProperty('email', 'test@mail.com');
      expect(result).toHaveProperty('company', 'c1');
      expect(result).toHaveProperty('name', 'Test User');
    });
  });

  describe('logout', () => {
    it('should return true when session is removed', async () => {
      mockSessionsService.remove.mockResolvedValue(true);
      const result = await service.logout('2');
      expect(result).toBe(true);
      expect(mockSessionsService.remove).toHaveBeenCalledWith('2');
    });
  });

  describe('refresh', () => {
    it('should throw ForbiddenException if session is missing hashedRt', async () => {
      mockSessionsService.findOne.mockResolvedValue({ id: '1' });
      await expect(service.refresh('1', 'refresh')).rejects.toThrow();
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockSessionsService.findOne.mockResolvedValue({
        id: '1',
        hashedRt: 'hashed_refresh',
        user: '1',
      });
      mockUsersService.findOne.mockResolvedValue(undefined);
      jest.spyOn(bcryptjs, 'compare').mockImplementation(async () => true);
      await expect(service.refresh('1', 'refresh')).rejects.toThrow();
    });

    it('should update session with new tokens', async () => {
      mockSessionsService.findOne.mockResolvedValue({
        id: '1',
        hashedRt: 'hashed_refresh',
        user: '1',
      });
      mockUsersService.findOne.mockResolvedValue({
        id: '1',
        email: 'test@mail.com',
      });
      mockJwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');
      mockSessionsService.update.mockResolvedValue({});
      mockConfigService.get.mockReturnValue('secret');
      jest.spyOn(bcryptjs, 'compare').mockImplementation(async () => true);
      jest
        .spyOn(bcryptjs, 'hash')
        .mockImplementation(async (v) => `hashed_${v}`);
      const result = await service.refresh('1', 'refresh_token');
      expect(result).toHaveProperty('accessToken', 'access_token');
      expect(result).toHaveProperty('refreshToken', 'refresh_token');
      expect(mockSessionsService.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          hashedRt: 'hashed_refresh_token',
          jwt_token: 'access_token',
        }),
      );
    });
  });
});
