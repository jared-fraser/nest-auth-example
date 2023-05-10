import { Ability } from '@casl/ability';
import { User } from '@next-auth-example/user/model/user.model';
import { ShopAction } from '@next-auth-example/shop/actions';
import { Shop } from '@next-auth-example/shop/model/shop.model';
import { ShopCaslAbilityFactory } from '@next-auth-example/shop/factories/shop-casl-ability.factory';

describe('Shop CASL Ability Factory', () => {
  let factory: ShopCaslAbilityFactory;

  beforeAll(() => {
    factory = new ShopCaslAbilityFactory();
  });

  describe('admin', () => {
    let ability: Ability;
    const admin = new User({
      roles: ['admin'],
    });

    const shop = new Shop({
      ownerId: 'b965170c-054b-4292-a1d1-d084e73bd289',
    });

    beforeAll(() => {
      ability = factory.createForUser(admin);
    });

    it("should allow admin's to create", () => {
      expect(ability.can(ShopAction.Create, shop)).toEqual(true);
    });

    it("should allow admin's to update", () => {
      expect(ability.can(ShopAction.Update, shop)).toEqual(true);
    });

    it("should allow admin's to read", () => {
      expect(ability.can(ShopAction.Read, shop)).toEqual(true);
    });

    it("should allow admin's to delete", () => {
      expect(ability.can(ShopAction.Delete, shop)).toEqual(true);
    });
  });

  describe('user', () => {
    let ability: Ability;
    const owner = new User({
      id: 'b965170c-054b-4292-a1d1-d084e73bd289',
      roles: [],
    });

    const user = new User({
      id: '2abbb7bb-c836-4b02-9457-6d12c5166a80',
      roles: [],
    });

    const shop = new Shop({
      ownerId: 'b965170c-054b-4292-a1d1-d084e73bd289',
    });

    describe('non-owner', () => {
      beforeAll(() => {
        ability = factory.createForUser(user);
      });

      it("should allow non-owner's to create", () => {
        expect(ability.can(ShopAction.Create, shop)).toEqual(true);
      });

      it("should not allow non-owner's to update", () => {
        expect(ability.can(ShopAction.Update, shop)).toEqual(false);
      });

      it("should not allow non-owner's to read", () => {
        expect(ability.can(ShopAction.Read, shop)).toEqual(false);
      });

      it("should not allow non-owner's to delete", () => {
        expect(ability.can(ShopAction.Delete, shop)).toEqual(false);
      });
    });

    describe('owner', () => {
      beforeAll(() => {
        ability = factory.createForUser(owner);
      });

      it("should allow owner's to create", () => {
        expect(ability.can(ShopAction.Create, shop)).toEqual(true);
      });

      it("should allow owner's to update", () => {
        expect(ability.can(ShopAction.Update, shop)).toEqual(true);
      });

      it("should allow owner's to read", () => {
        expect(ability.can(ShopAction.Read, shop)).toEqual(true);
      });

      it("should allow owner's to delete", () => {
        expect(ability.can(ShopAction.Delete, shop)).toEqual(true);
      });
    });
  });
});
