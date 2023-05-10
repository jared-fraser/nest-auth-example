import { Resolver, Query } from '@nestjs/graphql';
import { User as UserDTO } from '@next-auth-example/user/dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '@next-auth-example/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '@next-auth-example/auth/guards/gql-auth.guard';
import { User } from '@next-auth-example/user/model/user.model';

@Resolver(UserDTO)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor() {}

  @Query(() => UserDTO)
  async getProfile(@CurrentUser() currentUser: User): Promise<UserDTO> {
    const dto = new UserDTO();
    dto.id = currentUser.id;
    dto.email = currentUser.email;
    dto.roles = currentUser.roles;
    return dto;
  }
}
