import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateAccessTokenPayload {
  @Field()
  token: string;
}
