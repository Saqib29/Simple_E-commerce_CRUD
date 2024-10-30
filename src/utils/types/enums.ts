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

export enum OrderStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

registerEnumType(ProductCategory, { name: 'ProductCategory' });
registerEnumType(OrderStatus, { name: 'OrderStatus' });
registerEnumType(Role, { name: 'Role' });