import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { ORDER_STATUS } from 'src/utils/common/constant';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    async create(userId: string, productId: string, quantity: number): Promise<Order> {
        const order = this.orderRepository.create({
            user: { id: userId },
            product: { id: productId },
            quantity,
            status: ORDER_STATUS.PENDING,
        });
        return this.orderRepository.save(order);
    }

    async cancel(id: string): Promise<Order> {
        await this.orderRepository.update(id, { status: ORDER_STATUS.CANCELLED });
        return this.orderRepository.findOne({ where: { id } });
    }

    async findByUser(userId: string): Promise<Order[]> {
        return this.orderRepository.find({
          where: { user: { id: userId } },
          relations: ['product'],
        });
    }

    async getTotalSalesPerCategory(): Promise<any[]> {
        return this.orderRepository
          .createQueryBuilder('order')
          .leftJoinAndSelect('order.product', 'product')
          .select('product.category', 'category')
          .addSelect('SUM(order.quantity * product.price)', 'totalSales')
          .groupBy('product.category')
          .getRawMany();
    }

    async getTopUsers(): Promise<any[]> {
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
