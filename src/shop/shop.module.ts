import { Module } from '@nestjs/common';
import { ShopService } from '@next-auth-example/shop/shop.service';
import { ShopResolver } from '@next-auth-example/shop/shop.resolver';
import { ShopCaslAbilityFactory } from './factories/shop-casl-ability.factory';
import { UserModule } from '@next-auth-example/user/user.module';

@Module({
  imports: [UserModule],
  providers: [ShopService, ShopResolver, ShopCaslAbilityFactory],
  exports: [ShopService],
})
export class ShopModule {}
