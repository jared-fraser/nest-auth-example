import { User } from '@next-auth-example/user/model/user.model';

export class Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  ownerId: string;
  owner: User;

  constructor(args) {
    Object.assign(this, args);
  }
}
