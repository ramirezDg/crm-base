import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { ClientsModule } from './clients/clients.module';
import { EntityDefinitionsModule } from './entity-definitions/entity-definitions.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { ActivityLogInterceptor } from './common/interceptors/activity-log.interceptor';
import { CustomFieldValuesModule } from './custom-field-values/custom-field-values.module';
import { EntitiesModule } from './entities/entities.module';
import { AtGuard } from './common/guards';
import { ErrorLogsModule } from './error-logs/error-logs.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { FilesModule } from './files/files.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    ClientsModule,
    EntityDefinitionsModule,
    ActivityLogsModule,
    CustomFieldValuesModule,
    EntitiesModule,
    ErrorLogsModule,
    FilesModule,
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ActivityLogInterceptor,
    /* {
      provide: 'APP_GUARD',
      useClass: AtGuard,
    }, */
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
