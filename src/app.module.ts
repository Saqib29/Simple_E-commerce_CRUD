import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { AppConfigModule } from './app-config-module/app-config-module.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { db_config } from './app-config-module/config';
import { SeederModule } from './seeder/seeder.module';


@Module({
  imports: [
    AppConfigModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: db_config.host,
      port: db_config.port,
      username: db_config.username,
      password: db_config.password,
      database: db_config.dbName,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false //db_config.db_query_log === 'true',
    }),
    UserModule, 
    ProductModule, 
    OrderModule, 
    AuthModule,
    SeederModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
  ],
})
export class AppModule {}
