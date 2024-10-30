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

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

registerEnumType(ProductCategory, { name: 'ProductCategory' });
registerEnumType(OrderStatus, { name: 'OrderStatus' });
registerEnumType(UserStatus, { name: 'UserStatus' });
registerEnumType(Role, { name: 'Role' });