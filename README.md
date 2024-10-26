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
  - Used beach to save per 100 among total to avoid over load to db and clashes
  - During seeder created another table to keep tract wether seed or not to avoid seed each time in application running. the seeder will run on the first run of the project.

- **GraphQL Implementation**
  - Query and Mutation
  - Implement basic queries with pagination
  - Code first approach
  - Apollo server

- **GraphQL Implementation**
  - Query and Mutation
  - Code first approach
  - Apollo server

- **Docker**
  - Implement Dockerfile and docker compose to run backend application and PostgresSQL.
  - Add pgAdmin service to docker compose to interact with database from GUI.
  - Add makefile to run simple command.
  

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
PORT=8181
NODE_ENV=
ORIGIN=
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USERNAME=saqib
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=ecommers
RUN_SEED=true
JWT_SECRET=secret
JWT_EXP=1h
BCRYPT_SALT=10
```

4. Run docker commands:
```bash
// to build the application
$ sudo docker compose up --build --detach 

// to see the logs
$ sudo docker compose logs --follow app 
```

**If you have installed make, then you can ignore number 4, instead run the following commands.**

>// To build and run <br>
$ sudo make build

>// To see logs <br>
$ sudo make logs

__To see more you can follow Makefile in the root directory.__

Now visit: `localhost:8181/graphql` to apollo playground.

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
