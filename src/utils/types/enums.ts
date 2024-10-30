import { registerEnumType } from "@nestjs/graphql";

export enum ProductCategory {
  ELECTRONICS = 'ELECTRONICS',
  CLOTHING = 'CLOTHING',
  BOOKS = 'BOOKS',
  HOME = 'HOME',
  SPORTS = 'SPORTS',
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}



registerEnumType(ProductCategory, { name: 'ProductCategory' });
registerEnumType(Role, { name: 'Role' });