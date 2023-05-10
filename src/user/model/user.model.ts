/**
 * this would normally be a type
 */
export class User {
  id: string;
  email: string;
  password: string;
  roles: string[];

  constructor(args) {
    Object.assign(this, args);
  }
}
