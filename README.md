# E-commerce API with NestJS, GraphQL, and PostgreSQL

A robust e-commerce API built with NestJS, GraphQL, and PostgreSQL, featuring JWT authentication, CRUD operations, and complex join queries for managing users, products, and orders.

## 🚀 Features

- **Authentication**
  - JWT-based authentication system
  - Secure user signup and signin
  - Passport integration for JWT strategy
  - Enable cors

- **Database Operations**
  - CRUD operations for products, users, and orders
  - Complex queries with table joins
  - Pagination
  - TypeORM integration for database interactions
  - Implement seeder to save 1000 data to each table

- **GraphQL Implementation**
  - Query and Mutation
  - Code first approach
  - Apollo server

## 🛠️ Tech Stack

- NestJS
- GraphQL
- PostgreSQL
- TypeORM
- Passport-JWT
- Node.js
- Docker
- Docker Compose

## 📋 version

- Node.js (v18)
- yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone git@github.com:Saqib29/gain_backend_task.git
cd gain_backend_task/
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the root directory and provide these values:
```env
PORT=
NODE_ENV=
ORIGIN=
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
RUN_SEED=true
JWT_SECRET=
JWT_EXP=
BCRYPT_SALT=
```

4. Run docker commands:
```bash
// to build the application
$ sudo docker compose up --build --detach 

// to see the logs
$ sudo docker compose logs --follow app 
```
Now visit: `localhost:3000/graphql` to apollo playground.

## 📚 Schemas

### Users schema
```schema
 users (
  id,
  email,
  password,
  orders
);
```

### Products Table
```schema
products (
    id, 
    name, 
    price, 
    category, 
    orders
);
```

### Orders Table
```schema
orders (
    id,
    user,
    product,
    status,
    status
);
```

## 📝 API Documentation

### Queries

```graphql
type Query {
  hello: String!
  users: [User!]!
  user(id: ID!): User!
  products(page: Int! = 1, limit: Int! = 10): [Product!]!
  product(id: ID!): Product!
  userOrders: [Order!]!
  totalSalesPerCategory: [TotalSalesPerCategoryDto!]!
  topUsers: [TopUserDto!]!
}
```

### Mutations

```graphql
type Mutation {
  createProduct(name: String!, category: String!, price: Float!): Product!
  updateProduct(
    id: ID!
    name: String!
    category: String!
    price: Float!
  ): Product!
  deleteProduct(id: ID!): Boolean!
  createOrder(productId: ID!, quantity: Float!): Order!
  cancelOrder(id: ID!): Order!
  signin(email: String!, password: String!): AuthPayload!
  signup(email: String!, password: String!): AuthPayload!
}

```

## 🔐 JWT Implementation

- JWT tokens are generated to successful authentication
- Tokens include user id and email
- tokens are set in the cookie
- Cookies expiration is set to 24 hours
- For time constraints missed to implement Refresh token functionality for token renewal

## 🌟 Best Practices Implemented

1. **Security**
   - Password hashing using bcrypt
   - JWT token validation

2. **Database**
   - TypeORM entities with proper relations
   - Use of database transactions where needed


## 👥 Author

Aminul Islam Saqib <br>
saqib.aminul@gmail.com
