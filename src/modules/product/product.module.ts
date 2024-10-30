import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { OrderItem } from 'src/utils/common/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, OrderItem])],
  providers: [ProductService, ProductResolver]
})
export class ProductModule {}
