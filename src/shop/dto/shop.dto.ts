import { User } from '@next-auth-example/user/dto/user.dto';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Shop {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  phone: string;

  ownerId: string;

  @Field()
  owner: User;
}
