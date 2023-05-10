import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateShopInput {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  phone: string;
}
