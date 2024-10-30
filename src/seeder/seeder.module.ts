import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { Product } from 'src/modules/product/product.entity';
import { Order } from 'src/modules/order/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order])],
  providers: [SeederService],
  exports: [SeederService]
})
export class SeederModule {}
