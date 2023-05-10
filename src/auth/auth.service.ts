import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '@next-auth-example/user/model/user.model';
import { UserService } from '@next-auth-example/user/user.service';
import { constants } from '@next-auth-example/auth/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  validateUser(email: string, password: string): User | null {
    const user = this.userService.findOneByEmail(email);

    // this normally would be checking hashed password
    if (user && password === user.password) {
      return user;
    }

    return null;
  }

  createRefreshToken(user: User): Promise<string> {
    const now = new Date();
    const tomorrow = new Date();
    // normally prefer shortlived jwts
    tomorrow.setDate(now.getDate() + 1);

    const payload = {
      sub: user.id,
      iat: Math.floor(now.getTime() / 1000),
      iss: constants.jwtIssuer,
      aud: constants.jwtAudience,
    };
    const options: JwtSignOptions = {
      expiresIn: Math.floor(tomorrow.getTime() / 1000).toString(),
    };
    return this.jwtService.signAsync(payload, options);
  }
}
