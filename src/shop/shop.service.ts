import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Shop } from '@next-auth-example/shop/model/shop.model';
import { User } from '@next-auth-example/user/model/user.model';

@Injectable()
export class ShopService {
  // this would be pulled from a different storage
  private readonly shops = [
    new Shop({
      id: 'e339e44e-c42f-4521-ba64-ab904c25904f',
      ownerId: 'ca16985c-856c-11eb-8dcd-0242ac130003',
      name: 'Fish & Chip Shop',
      address: '12 Smith Street, Brisbane, QLD, 4000',
      phone: '+6131321322',
    }),
    new Shop({
      id: '7a9b8c2f-6baf-4a9a-bf72-ad91bcefce07',
      ownerId: 'dc5752cc-856c-11eb-8dcd-0242ac130003',
      name: "User's Shop",
      address: '1 Abc Avenue, Brisbame, QLD, 4000',
      phone: '+532423222',
    }),
  ];

  constructor() {}

  create({
    address,
    name,
    phone,
    owner,
  }: {
    address: string;
    name: string;
    phone: string;
    owner: User;
  }) {
    const shop = new Shop({
      id: uuidv4(),
      address,
      name,
      phone,
      owner,
      ownerId: owner.id,
    });
    this.shops.push(shop);
    return shop;
  }

  updateOrCreate(shop: Shop) {
    const index = this.shops.findIndex((element) => {
      element.id === shop.id;
    });

    if (index >= 0) {
      this.shops[index] = shop;
    } else {
      this.shops.push(shop);
    }
  }

  findOneById(id: string): Shop | undefined {
    return this.shops.find((shop) => {
      return shop.id === id;
    });
  }

  findAll(): Shop[] {
    return this.shops;
  }
}
