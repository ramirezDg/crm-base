import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../api/roles/entities/role.entity';
import { Permission } from '../../api/permissions/entities/permission.entity';
import { RolePermission } from '../../api/role-permissions/entities/role-permission.entity';
import { Company } from '../../api/companies/entities/company.entity';
import { Repository } from 'typeorm';
import { INestApplicationContext } from '@nestjs/common';

export async function seedRolesAndPermissions(app: INestApplicationContext) {
  const companyRepo = app.get<Repository<Company>>(getRepositoryToken(Company));
  const roleRepo = app.get<Repository<Role>>(getRepositoryToken(Role));
  const permRepo = app.get<Repository<Permission>>(
    getRepositoryToken(Permission),
  );
  const rolePermRepo = app.get<Repository<RolePermission>>(
    getRepositoryToken(RolePermission),
  );

  let company = await companyRepo.findOne({ where: { name: 'Empresa Demo' } });
  if (!company) {
    company = companyRepo.create({
      name: 'Empresa Demo',
      slug: 'empresa-demo',
      email: 'demo@empresa.com',
      status: true,
    });
    await companyRepo.save(company);
  }

  const roles = [
    'Admin',
    'SuperAdmin',
    'Manager',
    'User',
    'Guest',
    'Auditor',
    'Support',
    'ReadOnly',
  ];

  const permissions = [
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'users.assignRole',
    'users.viewActivity',
    'companies.create',
    'companies.read',
    'companies.update',
    'companies.delete',
    'companies.assignUser',
    'entities.create',
    'entities.read',
    'entities.update',
    'entities.delete',
    'entitiesDefinitions.create',
    'entitiesDefinitions.read',
    'entitiesDefinitions.update',
    'entitiesDefinitions.delete',
    'clients.create',
    'clients.read',
    'clients.update',
    'clients.delete',
    'clients.assignCompany',
    'roles.create',
    'roles.read',
    'roles.update',
    'roles.delete',
    'roles.assignPermission',
    'permissions.create',
    'permissions.read',
    'permissions.update',
    'permissions.delete',
    'customFields.create',
    'customFields.read',
    'customFields.update',
    'customFields.delete',
    'customFieldValues.create',
    'customFieldValues.read',
    'customFieldValues.update',
    'customFieldValues.delete',
    'files.upload',
    'files.download',
    'files.read',
    'files.delete',
    'activityLogs.read',
    'activityLogs.export',
    'settings.read',
    'settings.update',
    'system.audit',
    'system.export',
    'system.import',
    'system.viewStats',
    'errorLogs.create',
    'errorLogs.read',
    'errorLogs.read',
    'errorLogs.update',
    'errorLogs.delete',
    'modules.create',
    'modules.read',
    'modules.update',
    'modules.delete',
  ];

  const permissionEntities: Permission[] = [];
  for (const key of permissions) {
    let perm = await permRepo.findOne({ where: { key } });
    if (!perm) {
      perm = permRepo.create({ key });
      await permRepo.save(perm);
    }
    permissionEntities.push(perm);
  }

  const roleEntities: Role[] = [];
  for (const name of roles) {
    let role = await roleRepo.findOne({
      where: { name, company: { id: company.id } },
      relations: ['company'],
    });
    if (!role) {
      role = roleRepo.create({
        name,
        description: `Rol de ${name}`,
        company: company,
      });
      await roleRepo.save(role);
    }
    roleEntities.push(role);
  }

  for (const role of roleEntities) {
    let permsToAssign: Permission[] = [];
    if (['Admin', 'SuperAdmin'].includes(role.name)) {
      permsToAssign = permissionEntities;
    } else if (role.name === 'Manager') {
      permsToAssign = permissionEntities.filter(
        (p) => !p.key.startsWith('system.'),
      );
    } else if (role.name === 'User') {
      permsToAssign = permissionEntities.filter((p) => p.key.endsWith('.read'));
    } else if (role.name === 'Guest') {
      permsToAssign = permissionEntities.filter(
        (p) => p.key.endsWith('.read') && !p.key.startsWith('settings.'),
      );
    } else if (role.name === 'Auditor') {
      permsToAssign = permissionEntities.filter(
        (p) => p.key === 'activityLogs.read' || p.key === 'system.audit',
      );
    } else if (role.name === 'Support') {
      permsToAssign = permissionEntities.filter((p) =>
        p.key.startsWith('files.'),
      );
    } else if (role.name === 'ReadOnly') {
      permsToAssign = permissionEntities.filter((p) => p.key.endsWith('.read'));
    }

    for (const perm of permsToAssign) {
      const exists = await rolePermRepo.findOne({
        where: { role: { id: role.id }, permission: { id: perm.id } },
        relations: ['role', 'permission'],
      });
      if (!exists) {
        const rolePerm = rolePermRepo.create({
          role: role,
          permission: perm,
        });
        await rolePermRepo.save(rolePerm);
      }
    }
  }

  console.log('Seed de roles y permisos completado');
}
