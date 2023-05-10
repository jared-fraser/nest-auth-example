import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '@next-auth-example/user/user.service';
import { constants } from '@next-auth-example/auth/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.jwtSecret,
      issuer: constants.jwtIssuer,
      audience: constants.jwtAudience,
    });
  }

  async validate(payload: any) {
    return this.userService.findOneById(payload.sub);
  }
}
