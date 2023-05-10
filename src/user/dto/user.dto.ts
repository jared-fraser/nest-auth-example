import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;
  @Field()
  email: string;
  @Field((type) => [String])
  roles: string[];
}
