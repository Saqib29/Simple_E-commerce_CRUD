import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { ORDER_STATUS } from 'src/utils/common/constant';
import { TopUserDto, TotalSalesPerCategoryDto } from 'src/utils/types/types';
import { Product } from 'src/product/product.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async create(userId: string, productId: string, quantity: number): Promise<Order> {
        const product = await this.productRepository.findOne({ where: { id: productId } })
        if (!product) throw new NotFoundException(`Product id ${productId} not found`);

        const order = this.orderRepository.create({
            user: { id: userId },
            product: { id: productId },
            quantity,
            status: ORDER_STATUS.PENDING,
        });
        await this.orderRepository.save(order);

        return this.orderRepository.findOne({
            where: { id: order.id },
            relations: ['product', 'user']
        })
    }

    async cancel(id: string): Promise<Order> {
        await this.orderRepository.update(id, { status: ORDER_STATUS.CANCELLED });
        return this.orderRepository.findOne({ 
            where: { id },
            relations: ['product', 'user']
        });
    }

    async findByUser(userId: string): Promise<Order[]> {
        return this.orderRepository.find({
          where: { user: { id: userId } },
          relations: ['product'],
        });
    }

    async getTotalSalesPerCategory(): Promise<TotalSalesPerCategoryDto[]> {
        return this.orderRepository
          .createQueryBuilder('order')
          .leftJoinAndSelect('order.product', 'product')
          .select('product.category', 'category')
          .addSelect('SUM(order.quantity * product.price)', 'totalSales')
          .groupBy('product.category')
          .getRawMany();
    }

    async getTopUsers(): Promise<TopUserDto[]> {
        return this.orderRepository
          .createQueryBuilder('order')
          .leftJoinAndSelect('order.user', 'user')
          .select('user.id', 'userId')
          .addSelect('user.email', 'userEmail')
          .addSelect('COUNT(order.id)', 'orderCount')
          .groupBy('user.id')
          .orderBy('orderCount', 'DESC')
          .limit(10)
          .getRawMany();
    }
}
