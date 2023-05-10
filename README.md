# NestJS Authorization Example

## Installation

1. yarn

## Start Up

1. yarn start:dev
2. open browser to http://localhost:3005/graphql

## Testing

1. yarn test
2. yarn test:e2e

## Roles

This solution uses two roles `admin` and `user`, since this is monolithic implementation it made sense to just load the user and get their current role from the database. However in a microservices architecture, this often won't be easily accessable, so the most appropriate solution would be to implement a permission based access control and store the permissions such as `shop:create` under a scopes flag, ensuring the access token is short lived.

### Rules

- Admin can list all shops
- User can only list shops they have created
- Admin & Users can create shops
- Admin can update any shop
- User can only update their own shop

## Create Access Token

Send a mutation request to the createAccessToken resolver
This was added as a mutation as it would normally create a session state in storage that could be revoked in the future if needed.

### Request
```graphql
mutation {
  createAccessToken(input: {
    email: "admin.user@example.com",
    password: "whyisthisinplaintext"
  }) {
    token
  }
}
```
### Response

```json
{
  "data": {
    "createAccessToken": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYzU3NTJjYy04NTZjLTExZWItOGRjZC0wMjQyYWMxMzAwMDMiLCJpYXQiOjE2MTU4OTA3MjUsImlzcyI6Imh0dHBzOi8vbXJ5dW0udGVzdCIsImF1ZCI6Imh0dHBzOi8vbXJ5dW0udGVzdCIsImV4cCI6MTYxNzUwNjcwMn0._ATBYTka-SYD6_SsXUdo4Go_vQVrGsqRNdy9YE8iijE"
    }
  }
}
```

## Get Profile
Fetches the current user's profile
Send a request with an `Authorization` header with the Bearer token from the `createAccessToken` response

### Request
```graphql
query {
  getProfile {
    id
    email
    roles
  }
}
```

### Response
```json
{
  "data": {
    "getProfile": {
      "id": "ca16985c-856c-11eb-8dcd-0242ac130003",
      "email": "admin.user@example.com",
      "roles": [
        "admin"
      ]
    }
  }
}
```

## Create Shop

### Request
Send a request with an `Authorization` header with the Bearer token from the `createAccessToken` response

```graphql
mutation {
  createShop(input: {
    address: "123 Test St",
    phone: "+61412221122",
    name: "my restuarant"
  }) {
    id
    name
    phone
    address
  }
}
```

### Response

```json
{
  "data": {
    "createShop": {
      "id": "2dfd1176-afb7-4c1a-aebf-adc2818fafe9",
      "name": "my restuarant 2",
      "phone": "+61412221122",
      "address": "123 Test St"
    }
  }
}
```

## Get Shops

### Request
Send a request with an `Authorization` header with the Bearer token from the `createAccessToken` response

```graphql
query {
  getShops {
    id
    name
    address
    phone
    owner {
      id
      email
    }
  }
}
```

### Response

```json
{
  "data": {
    "getShops": [
      {
        "id": "e339e44e-c42f-4521-ba64-ab904c25904f",
        "name": "Fish & Chip Shop",
        "address": "12 Smith Street, Brisbane, QLD, 4000",
        "phone": "+6131321322",
        "owner": {
          "id": "ca16985c-856c-11eb-8dcd-0242ac130003",
          "email": "admin.user@example.com"
        }
      }
    ]
  }
}
```

## Get Shop By Id

### Request
Send a request with an `Authorization` header with the Bearer token from the `createAccessToken` response

```graphql
query {
  getShop(id: "e339e44e-c42f-4521-ba64-ab904c25904f") {
    id
    address
    phone
    name
    owner {
      id
    }
  }
}
```

### Response

```json
{
  "data": {
    "getShop": {
      "id": "e339e44e-c42f-4521-ba64-ab904c25904f",
      "address": "12 Smith Street, Brisbane, QLD, 4000",
      "phone": "+6131321322",
      "name": "Fish & Chip Shop",
      "owner": {
        "id": "ca16985c-856c-11eb-8dcd-0242ac130003"
      }
    }
  }
}
```

## Update Shop By Id

### Request
Send a request with an `Authorization` header with the Bearer token from the `createAccessToken` response

```graphql
mutation updateShop {
  updateShop(input: {
    id: "e339e44e-c42f-4521-ba64-ab904c25904f"
    name: "My New Name"
    address: "My New Address"
    phone: "My New Phone"
  }) {
    id
    name
    address
    phone
    owner {
      id
    }
  }
}
```

### Response

```json
{
  "data": {
    "updateShop": {
      "id": "e339e44e-c42f-4521-ba64-ab904c25904f",
      "name": "My New Name",
      "address": "My New Address",
      "phone": "My New Phone",
      "owner": {
        "id": "ca16985c-856c-11eb-8dcd-0242ac130003"
      }
    }
  }
}
```

## Further considersations

1. Pagination would be affected by this approach, since we are filtering out an already paginated resultset, this would mean inaccuracies with total results and results per page.
2. While this solution fits a monolithic architecture, it would vary for a microservices solution. 
In a microservices architecture you necessarily wouldn't have access to user data easily, so you would have to encode the user's scopes within the token itself.
3. There is a whole lot of complexity around graphql subqueries and permission checking. An example of this would be

```graphql
query {
  getShops {
    id
    name
    address
    phone
    owner {
      id
      email
    }
  }
}
```
If there was a permission check that you could only see owner information if you are an admin OR you where the owner then you would need to check at each resolveField level. For the purpose of this test I haven't implemented this type of check but it's something to be considered.

4. Definitely need more tests, but felt it was sufficient to showcase unit and integration testing.

