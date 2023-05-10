import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { gql } from 'apollo-server-core';
import { AppModule } from '@next-auth-example/app.module';
import { AuthService } from '@next-auth-example/auth/auth.service';
import { User } from '@next-auth-example/user/model/user.model';
import { ShopService } from '@next-auth-example/shop/shop.service';
import { GraphQLErrorFilter } from '@next-auth-example/filters/graphql-error.filter';

describe('Shop Resolver (e2e)', () => {
  let app: INestApplication;
  let shopService: ShopService;
  let user: User;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(null, { logger: false });
    app.useGlobalFilters(new GraphQLErrorFilter());
    await app.init();

    const authService: AuthService = app.get(AuthService);

    // normally this would be persisted but I'm abusing the fact that it's stored in memory
    user = new User({
      id: 'dc5752cc-856c-11eb-8dcd-0242ac130003',
      roles: [],
    });
    token = await authService.createRefreshToken(user);

    shopService = app.get(ShopService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('can get a list of shops', async () => {
    const query = gql`
      query {
        getShops {
          id
          name
          address
          phone
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        operationName: null,
        query: query.loc.source.body,
      });

    const data = response.body.data.getShops;

    expect(data.length).toEqual(1);
    expect(data[0].id).toEqual('7a9b8c2f-6baf-4a9a-bf72-ad91bcefce07');
    expect(data[0].name).toEqual("User's Shop");
    expect(data[0].address).toEqual('1 Abc Avenue, Brisbame, QLD, 4000');
    expect(data[0].phone).toEqual('+532423222');
  });

  it('allows a user to create a shop', async () => {
    const query = gql`
      mutation createShop($address: String!, $phone: String!, $name: String!) {
        createShop(input: { address: $address, phone: $phone, name: $name }) {
          id
          name
          address
          phone
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        operationName: null,
        query: query.loc.source.body,
        variables: {
          address: '123 Test St',
          phone: '+61412221122',
          name: 'my restuarant 2',
        },
      });

    const data = response.body.data.createShop;
    expect(data.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(data.name).toEqual('my restuarant 2');
    expect(data.address).toEqual('123 Test St');
    expect(data.phone).toEqual('+61412221122');
  });

  it('allows a user to fetch a shop', async () => {
    const shop = shopService.create({
      address: '12 Fake Street, Brisbane, QLD, 4000',
      phone: '+61664422',
      name: 'My Mock Restuarant',
      owner: user,
    });
    const query = gql`
      query getShop($id: ID!) {
        getShop(id: $id) {
          id
          name
          address
          phone
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        operationName: null,
        query: query.loc.source.body,
        variables: {
          id: shop.id,
        },
      });

    const data = response.body.data.getShop;

    expect(data.id).toEqual(shop.id);
    expect(data.name).toEqual('My Mock Restuarant');
    expect(data.address).toEqual('12 Fake Street, Brisbane, QLD, 4000');
    expect(data.phone).toEqual('+61664422');
  });

  it('allows an owner to update a shop', async () => {
    const shop = shopService.create({
      address: '12 Mock Street, Brisbane, QLD, 4000',
      phone: '+5242323344',
      name: 'MocksRUs',
      owner: user,
    });

    const query = gql`
      mutation updateShop(
        $id: ID!
        $name: String!
        $address: String!
        $phone: String!
      ) {
        updateShop(
          input: { id: $id, name: $name, address: $address, phone: $phone }
        ) {
          id
          name
          address
          phone
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        operationName: null,
        query: query.loc.source.body,
        variables: {
          id: shop.id,
          name: 'UpdatedShopName',
          address: '123 Updated Street',
          phone: '+611111111',
        },
      });

    const data = response.body.data.updateShop;

    expect(data.id).toEqual(shop.id);
    expect(data.name).toEqual('UpdatedShopName');
    expect(data.address).toEqual('123 Updated Street');
    expect(data.phone).toEqual('+611111111');
  });

  it('reject a user updating another shop', async () => {
    const shop = shopService.create({
      address: '12 Mock Street, Brisbane, QLD, 4000',
      phone: '+5242323344',
      name: 'MocksRUs',
      owner: new User({
        id: '14cfeeea-36d6-4d25-9b13-f4843b4c0f26',
      }),
    });

    const query = gql`
      mutation updateShop(
        $id: ID!
        $name: String!
        $address: String!
        $phone: String!
      ) {
        updateShop(
          input: { id: $id, name: $name, address: $address, phone: $phone }
        ) {
          id
          name
          address
          phone
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        operationName: null,
        query: query.loc.source.body,
        variables: {
          id: shop.id,
          name: 'UpdatedShopName',
          address: '123 Updated Street',
          phone: '+611111111',
        },
      });

    const body = response.body;
    expect(body.data).toBeNull();
    expect(body.errors.length).toEqual(1);
    expect(body.errors[0].message).toEqual('Permission denied');
  });
});
