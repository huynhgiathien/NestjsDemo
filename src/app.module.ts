import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
// Connect to db
import { KnexModule } from 'nest-knexjs';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UsersController } from './users/users.controller';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    UsersModule,
    CompaniesModule,
    AuthModule,
    SessionModule,
    KnexModule.forRoot({
      config: {
        client: 'pg',
        connection: {
          user: 'postgres',
          password: '123',
          database: 'hr-db',
        },
        pool: {
          min: 2,
          max: 10,
        },
        migrations: {
          tableName: 'knex_migrations',
        },
      },
    }),
    AuthModule,
    SessionModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .forRoutes({ path: 'users', method: RequestMethod.GET });
      .forRoutes(UsersController);
  }
}
