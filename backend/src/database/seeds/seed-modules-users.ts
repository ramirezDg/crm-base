import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModulesUser } from '../../modules/entities/module.entity';

export async function seedModulesFromTables() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const moduleRepo = app.get<Repository<ModulesUser>>(
    getRepositoryToken(ModulesUser),
  );

  const moduleGroups = [
    {
      name: 'Records',
      icon: 'activity',
      children: [
        {
          name: 'Activity Logs',
          description: 'Module Activity Logs',
          path: '/aclo',
          icon: 'activity',
        },
        {
          name: 'Error Logs',
          description: 'Module Error Logs',
          path: '/erlo',
          icon: 'bug',
        },
      ],
    },
    {
      name: 'Entities',
      icon: 'box',
      children: [
        {
          name: 'Entities',
          description: 'Module Entities',
          path: '/en',
          icon: 'box',
        },
        {
          name: 'Entity Definition',
          description: 'Module Entity Definition',
          path: '/ende',
          icon: 'filebox',
        },
      ],
    },
    {
      name: 'Custom Fields',
      icon: 'tag',
      children: [
        {
          name: 'Custom Field',
          description: 'Module Custom Field',
          path: '/cufi',
          icon: 'tag',
        },
        {
          name: 'Custom Field Value',
          description: 'Module Custom Field Value',
          path: '/cufiva',
          icon: 'hash',
        },
      ],
    },
    {
      name: 'Security and Access',
      icon: 'shielduser',
      children: [
        {
          name: 'Users',
          description: 'Module Users',
          path: '/us',
          icon: 'users',
        },
        {
          name: 'Role',
          description: 'Module Role',
          path: '/ro',
          icon: 'shielduser',
        },
        {
          name: 'Permission',
          description: 'Module Permission',
          path: '/pe',
          icon: 'userlock',
        },
        {
          name: 'Role Permission',
          description: 'Module Role Permission',
          path: '/rope',
          icon: 'shieldhalf',
        },
      ],
    },
    {
      name: 'Companies',
      icon: 'factory',
      children: [
        {
          name: 'Companies',
          description: 'Module Companies',
          path: '/co',
          icon: 'factory',
        },
      ],
    },
    {
      name: 'Clients',
      icon: 'handshake',
      children: [
        {
          name: 'Client',
          description: 'Module Client',
          path: '/cl',
          icon: 'handshake',
        },
      ],
    },
    {
      name: 'Files',
      icon: 'paperclip',
      children: [
        {
          name: 'Files',
          description: 'Module Files',
          path: '/fi',
          icon: 'paperclip',
        },
      ],
    },
  ];

  await moduleRepo
    .createQueryBuilder()
    .delete()
    .where('parentId IS NOT NULL')
    .execute();

  for (const group of moduleGroups) {
    let parentModule = await moduleRepo.findOne({
      where: { name: group.name },
    });
    if (!parentModule) {
      parentModule = moduleRepo.create({
        name: group.name,
        description: `Agrupador de ${group.name}`,
        path: '',
        icon: group.icon,
        status: true,
        parent: undefined,
      });
      parentModule = await moduleRepo.save(parentModule);
    }

    for (const child of group.children) {
      // Siempre crear el hijo, ya que los antiguos fueron eliminados
      const childModule = moduleRepo.create({
        name: child.name,
        description: child.description,
        path: child.path,
        icon: child.icon,
        status: true,
        parent: parentModule,
      });
      await moduleRepo.save(childModule);
    }
  }

  console.log('Seed de módulos agrupados completado');
  await app.close();
}

seedModulesFromTables();
