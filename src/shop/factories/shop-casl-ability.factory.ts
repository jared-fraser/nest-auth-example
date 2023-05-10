import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { User } from '@next-auth-example/user/model/user.model';
import { ShopAction } from '@next-auth-example/shop/actions';
import { Shop } from '@next-auth-example/shop/model/shop.model';

type Subjects = InferSubjects<typeof Shop | typeof User> | 'all';

export type AppAbility = Ability<[ShopAction, Subjects]>;

@Injectable()
export class ShopCaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[ShopAction, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    /**
     - Admin can list all shops
    - User can only list shops they have created
    - Admin & Users can create shops
    - Admin can update any shop
    - User can only update their own shop
    - User can only delete their own shop
     */
    if (user.roles.indexOf('admin') >= 0) {
      can(ShopAction.Manage, 'all');
    } else {
      can(ShopAction.Create, 'all');
      can(ShopAction.Read, Shop, { ownerId: user.id });
      can(ShopAction.Update, Shop, { ownerId: user.id });
      can(ShopAction.Delete, Shop, { ownerId: user.id });
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
