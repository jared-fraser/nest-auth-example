import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAccessTokenInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
