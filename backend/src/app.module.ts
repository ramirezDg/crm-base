import { MailerModule } from './common/mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './api/auth/auth.module';
import { CompaniesModule } from './api/companies/companies.module';
import { RolesModule } from './api/roles/roles.module';
import { PermissionsModule } from './api/permissions/permissions.module';
import { RolePermissionsModule } from './api/role-permissions/role-permissions.module';
import { ClientsModule } from './api/clients/clients.module';
import { EntityDefinitionsModule } from './api/entity-definitions/entity-definitions.module';
import { ActivityLogsModule } from './api/activity-logs/activity-logs.module';
import { ActivityLogInterceptor } from './common/interceptors/activity-log.interceptor';
import { CustomFieldValuesModule } from './api/custom-field-values/custom-field-values.module';
import { EntitiesModule } from './api/entities/entities.module';
import { AtGuard } from './common/guards';
import { ErrorLogsModule } from './api/error-logs/error-logs.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { FilesModule } from './api/files/files.module';
import { ModulesModule } from './api/modules/modules.module';
import { UsersModule } from './api/users/users.module';
import { SessionsModule } from './api/sessions/sessions.module';

@Module({
  imports: [
    MailerModule,
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
    MailerModule,
    SessionsModule,
  ],
  controllers: [],
  providers: [
    ActivityLogInterceptor,
    {
      provide: 'APP_GUARD',
      useClass: AtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
