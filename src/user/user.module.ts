import { Module } from '@nestjs/common';
import { UserService } from '@next-auth-example/user/user.service';
import { UserResolver } from '@next-auth-example/user/user.resolver';

@Module({
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
