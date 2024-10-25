import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { Product } from 'src/product/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Product])],
    providers: [OrderResolver, OrderService],
})
export class OrderModule {}