import { UserModule } from '@next-auth-example/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from '@next-auth-example/auth/auth.resolver';
import { AuthService } from '@next-auth-example/auth/auth.service';
import { GqlAuthGuard } from '@next-auth-example/auth/guards/gql-auth.guard';
import { JwtStrategy } from '@next-auth-example/auth/strategy/jwt.strategy';
import { constants } from '@next-auth-example/auth/constants';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: constants.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, GqlAuthGuard],
  exports: [AuthModule, JwtModule],
})
export class AuthModule {}
