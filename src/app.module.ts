import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { RoleRatesModule } from './modules/role-rates/role-rates.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectActivitiesModule } from './modules/project-activities/project-activities.module';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { SalesOrdersModule } from './modules/sales-orders/sales-orders.module';
import { PoSoMembersModule } from './modules/po-so-members/po-so-members.module';
import { SupportTicketsModule } from './modules/support-tickets/support-tickets.module';
import { BillingModule } from './modules/billing/billing.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', 'Admin123'),
        database: configService.get<string>(
          'DB_DATABASE',
          'project_management',
        ),
        autoLoadEntities: true,
        synchronize: true, // Auto-create tables in dev. In production, use migrations!
      }),
    }),
    UsersModule,
    RolesModule,
    RoleRatesModule,
    ProjectsModule,
    ProjectActivitiesModule,
    PurchaseOrdersModule,
    SalesOrdersModule,
    PoSoMembersModule,
    SupportTicketsModule,
    BillingModule,
    AuthModule,
  ]
})
export class AppModule { }
