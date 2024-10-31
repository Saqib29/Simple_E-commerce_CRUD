import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order])],
  providers: [SeederService],
  exports: [SeederService]
})
export class SeederModule {}
