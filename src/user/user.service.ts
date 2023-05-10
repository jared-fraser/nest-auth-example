import { Injectable } from '@nestjs/common';
import { User } from '@next-auth-example/user/model/user.model';

@Injectable()
export class UserService {
  // this would be pulled from a different storage
  private readonly users = [
    new User({
      id: 'ca16985c-856c-11eb-8dcd-0242ac130003',
      email: 'admin.user@example.com',
      password: 'whyisthisinplaintext',
      roles: ['admin'],
    }),
    new User({
      id: 'dc5752cc-856c-11eb-8dcd-0242ac130003',
      email: 'normal.user@example.com',
      password: 'hopenobodyseesthis',
      roles: [],
    }),
  ];

  constructor() {}

  findOneById(id: string): User | undefined {
    return this.users.find((user) => {
      return user.id === id;
    });
  }

  findOneByEmail(email: string): User | undefined {
    return this.users.find((user) => {
      return user.email === email;
    });
  }
}
