import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ForbiddenError, UserInputError } from 'apollo-server-errors';

import { Shop as ShopDTO } from '@next-auth-example/shop/dto/shop.dto';
import { CurrentUser } from '@next-auth-example/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '@next-auth-example/auth/guards/gql-auth.guard';
import { User } from '@next-auth-example/user/model/user.model';
import { ShopService } from '@next-auth-example/shop/shop.service';
import { CreateShopInput } from '@next-auth-example/shop/dto/create-shop-input.dto';
import { ShopCaslAbilityFactory } from '@next-auth-example/shop/factories/shop-casl-ability.factory';
import { ShopAction } from '@next-auth-example/shop/actions';
import { UpdateShopInput } from '@next-auth-example/shop/dto/update-shop-input.dto';
import { UserService } from '@next-auth-example/user/user.service';
import { User as UserDTO } from '@next-auth-example/user/dto/user.dto';
import { Shop } from './model/shop.model';

@Resolver(ShopDTO)
@UseGuards(GqlAuthGuard)
export class ShopResolver {
  constructor(
    private readonly shopService: ShopService,
    private readonly shopCaslAbilityFactory: ShopCaslAbilityFactory,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => ShopDTO)
  async createShop(
    @CurrentUser() currentUser: User,
    @Args('input', {
      description: 'Specifies the fields to use when creating a shop',
    })
    input: CreateShopInput,
  ): Promise<ShopDTO> {
    const shop = this.shopService.create({ ...input, owner: currentUser });

    const dto = new ShopDTO();
    dto.id = shop.id;
    dto.address = shop.address;
    dto.phone = shop.phone;
    dto.name = shop.name;
    dto.ownerId = shop.ownerId;
    return dto;
  }

  @Mutation(() => ShopDTO)
  async updateShop(
    @CurrentUser() currentUser: User,
    @Args('input', {
      description: 'Specifies the fields to use when updating a shop',
    })
    input: UpdateShopInput,
  ): Promise<ShopDTO> {
    const shop = this.shopService.findOneById(input.id);

    if (shop === undefined) {
      throw new UserInputError('Shop does not exist');
    }

    const ability = this.shopCaslAbilityFactory.createForUser(currentUser);
    if (ability.cannot(ShopAction.Update, shop)) {
      throw new ForbiddenError('Permission denied');
    }

    shop.address = input.address;
    shop.phone = input.phone;
    shop.name = input.name;

    this.shopService.updateOrCreate(shop);

    const dto = new ShopDTO();
    dto.id = shop.id;
    dto.address = shop.address;
    dto.phone = shop.phone;
    dto.name = shop.name;
    dto.ownerId = shop.ownerId;
    return dto;
  }

  @Query(() => [ShopDTO])
  async getShops(@CurrentUser() currentUser: User): Promise<ShopDTO[]> {
    const shops = this.shopService.findAll();
    const ability = this.shopCaslAbilityFactory.createForUser(currentUser);

    return shops
      .filter((shop) => {
        return ability.can(ShopAction.Read, shop);
      })
      .map((shop) => {
        const dto = new ShopDTO();
        dto.id = shop.id;
        dto.address = shop.address;
        dto.phone = shop.phone;
        dto.name = shop.name;
        dto.ownerId = shop.ownerId;
        return dto;
      });
  }

  @Query(() => ShopDTO)
  async getShop(
    @CurrentUser() currentUser: User,
    @Args('id', { type: () => ID }) shopId: string,
  ): Promise<ShopDTO> {
    const ability = this.shopCaslAbilityFactory.createForUser(currentUser);

    const shop = this.shopService.findOneById(shopId);
    if (shop === undefined) {
      throw new UserInputError(`No shop with ID ${shopId}`);
    }

    if (ability.cannot(ShopAction.Read, shop)) {
      throw new ForbiddenError('Permission denied');
    }

    const dto = new ShopDTO();
    dto.id = shop.id;
    dto.address = shop.address;
    dto.phone = shop.phone;
    dto.name = shop.name;
    dto.ownerId = shop.ownerId;
    return dto;
  }

  // this should use a dataloader
  @ResolveField()
  async owner(@Parent() shop: ShopDTO) {
    const { ownerId } = shop;
    const user = this.userService.findOneById(ownerId);
    // really should use a mapper class so it's not so repetitive
    const dto = new UserDTO();
    dto.id = user.id;
    dto.email = user.email;
    dto.roles = user.roles;
    return dto;
  }
}
