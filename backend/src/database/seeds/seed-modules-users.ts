import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ModulesUser } from '../../modules/entities/module.entity';

function formatModuleName(tableName: string): string {
  return tableName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function generateUniquePath(tableName: string, usedPaths: Set<string>): string {
  const words = tableName.replace(/[-_]/g, ' ').split(' ').filter(Boolean);
  for (let len = 2; len <= Math.max(...words.map((w) => w.length)); len++) {
    let candidate =
      '/' + words.map((w) => w.substring(0, len).toLowerCase()).join('');
    if (!usedPaths.has(candidate)) {
      usedPaths.add(candidate);
      return candidate;
    }
  }
  let extra = 1;
  while (true) {
    let candidate =
      '/' +
      words
        .map((w, i) =>
          i === words.length - 1
            ? w.toLowerCase() + extra
            : w.substring(0, 2).toLowerCase(),
        )
        .join('');
    if (!usedPaths.has(candidate)) {
      usedPaths.add(candidate);
      return candidate;
    }
    extra++;
  }
}

export async function seedModulesFromTables() {
  const usedPaths = new Set<string>();
  const app = await NestFactory.createApplicationContext(AppModule);
  const moduleRepo = app.get<Repository<ModulesUser>>(
    getRepositoryToken(ModulesUser),
  );
  const dataSource = app.get<DataSource>(getDataSourceToken());

  const tableNames = await dataSource.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT IN ('migrations', 'modules')
  `);

  for (const table of tableNames) {
    const formattedName = formatModuleName(table.table_name);
    const exists = await moduleRepo.findOne({
      where: { name: formattedName },
    });
    if (!exists) {
      const uniquePath = generateUniquePath(table.table_name, usedPaths);
      const module = moduleRepo.create({
        name: formattedName,
        description: `Module ${formattedName}`,
        path: uniquePath,
        icon: 'icon',
        status: true,
        parent: undefined,
      });
      await moduleRepo.save(module);
    }
  }

  console.log('Seed de módulos desde tablas completado');
  await app.close();
}

seedModulesFromTables();
