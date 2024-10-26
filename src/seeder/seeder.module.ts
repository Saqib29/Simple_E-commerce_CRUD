import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';
import { Order } from 'src/order/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order])],
  providers: [SeederService],
  exports: [SeederService]
})
export class SeederModule {}
