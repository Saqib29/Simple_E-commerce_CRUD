import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { TopUserDto, TotalSalesPerCategoryDto } from 'src/utils/types/types';
import { Product } from 'src/modules/product/entities/product.entity';
import { UserRankingDto } from './dto/user-ranking.dto';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async create(userId: string, productId: string, quantity: number): Promise<Order> {
        const product = await this.productRepository.findOne({ where: { id: parseInt(productId) } })
        if (!product) throw new NotFoundException(`Product id ${productId} not found`);

        // const order = this.orderRepository.create({
        //     user: { id: parseInt(userId) },
        //     product: { id: productId },
        //     quantity,
        //     status: ORDER_STATUS.PENDING,
        // });
        // await this.orderRepository.save(order);
        return new Order();
        // return this.orderRepository.findOne({
        //     where: { id: order.id },
        //     relations: ['product', 'user']
        // })
    }

    async cancel(id: string): Promise<Order> {
        // await this.orderRepository.update(id, { status: ORDER_STATUS.CANCELLED });
        // return this.orderRepository.findOne({ 
        //     where: { id },
        //     relations: ['product', 'user']
        // });
        return new Order();
    }

    async findByUser(userId: string): Promise<Order[]> {
        // return this.orderRepository.find({
        //   where: { user: { id: userId } },
        //   relations: ['product', 'user'],
        // });
        return [new Order()]
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

    async getTopRankingUsers(limit: number = 10): Promise<UserRankingDto[]> {
        try {
            const result = await this.orderRepository
                .createQueryBuilder('order')
                .select('user.id', 'userId')
                .addSelect('COUNT(order.id)', 'orderCount')
                .innerJoinAndSelect('order.user', 'user')
                .groupBy('user.id')
                .orderBy('orderCount', 'DESC')
                .limit(limit)
                .getRawMany();
            
            return result.map(item => ({
                user:  item.user,
                orderCount: parseInt(item.orderCount, 10),
            }));
        } catch (error) {
            this.logger.error(`Failed to retrieve top-ranking users: ${error.message}`);
            throw new InternalServerErrorException('Could not retrieve top-ranking users');
        }
    }
}
