import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';

import { AuthService } from '@next-auth-example/auth/auth.service';
import { CreateAccessTokenPayload } from '@next-auth-example/auth/dto/create-access-token-payload.dto';
import { CreateAccessTokenInput } from '@next-auth-example/auth/dto/create-access-token-input.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => CreateAccessTokenPayload)
  async createAccessToken(
    @Args('input', {
      description: 'Specifies the fields to use when creating an access token',
    })
    input: CreateAccessTokenInput,
  ): Promise<CreateAccessTokenPayload> {
    const user = this.authService.validateUser(input.email, input.password);

    if (user === null) {
      throw new UserInputError('Invalid email or password');
    }

    const accessToken = await this.authService.createRefreshToken(user);

    const dto = new CreateAccessTokenPayload();
    dto.token = accessToken;
    return dto;
  }
}
