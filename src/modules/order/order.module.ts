import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { Product } from 'src/modules/product/entities/product.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Product]),
        UserModule
    ],
    providers: [OrderResolver, OrderService],
})
export class OrderModule {}