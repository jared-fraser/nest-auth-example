import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from '@next-auth-example/user/user.module';
import { AuthModule } from '@next-auth-example/auth/auth.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ShopModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
