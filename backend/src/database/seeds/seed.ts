import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { seedRolesAndPermissions } from './seed-roles-permissions';
import { seedModulesFromTables } from './seed-modules-users';
import { Company } from '../../api/companies/entities/company.entity';
import { Role } from '../../api/roles/entities/role.entity';
import { Users } from '../../api/users/entities/user.entity';


async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Primero crea roles y permisos
  await seedRolesAndPermissions(app);

  const companyRepo = app.get<Repository<Company>>(getRepositoryToken(Company));
  const roleRepo = app.get<Repository<Role>>(getRepositoryToken(Role));
  const userRepo = app.get<Repository<Users>>(getRepositoryToken(Users));

  let company = await companyRepo.findOne({ where: { name: 'Empresa Demo' } });

  if (!company) {
    throw new Error('No se encontró la compañía "Empresa Demo".');
  }

  // Busca el rol SuperAdmin
  let superAdminRole = await roleRepo.findOne({
    where: { name: 'SuperAdmin', company: { id: company.id } },
    relations: ['company'],
  });

  let readOnlyRole = await roleRepo.findOne({
    where: { name: 'ReadOnly', company: { id: company.id } },
    relations: ['company'],
  });

  // Crea el usuario SuperAdmin si no existe
  let superAdminUser = await userRepo.findOne({
    where: { email: 'superadmin@demo.com' },
  });

  let readOnlyUser = await userRepo.findOne({
    where: { email: 'readonly@demo.com' },
  });

  if (!superAdminUser) {
    const password = await bcrypt.hash('superadmin123', 10);
    superAdminUser = userRepo.create({
      name: 'Super',
      lastName: 'Admin',
      email: 'superadmin@demo.com',
      password,
      role: superAdminRole!,
      company: company,
      status: true,
    });
    await userRepo.save(superAdminUser);
  }

  if (!readOnlyUser) {
    const password = await bcrypt.hash('readonly123', 10);
    superAdminUser = userRepo.create({
      name: 'Read',
      lastName: 'User',
      email: 'readonly@demo.com',
      password,
      role: readOnlyRole!,
      company: company,
      status: true,
    });
    await userRepo.save(superAdminUser);
  }

  console.log('Seed de SuperAdmin completado');

  await seedModulesFromTables();

  await app.close();
}

bootstrap();
