import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/modules/product/entities/product.entity';
import { UserRankingDto } from './dto/user-ranking.dto';
import { ICurrentUser } from 'src/utils/interface/currentUser.interface';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UserService } from '../user/user.service';
import { OrderStatus } from 'src/utils/types/enums';
import { CancelOrderDto } from './dto/cancel-order.dto';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private userService: UserService,
    ) {}

    async placeOrder(userId: string, placeOrderDto: PlaceOrderDto): Promise<Order> {
        const { items, totalAmount } = placeOrderDto;

        try {
            const user = await this.userService.findById(parseInt(userId));
            if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

            let totalAmount = 0;
            const orderItems = await Promise.all(
                items.map(async (item) => {
                    const product = await this.productRepository.findOne({ 
                        where: { id: item.productId }
                     });
                    if (!product) throw new NotFoundException(`Product not found`);

                    const itemTotal = product.price * item.quantity;
                    totalAmount += itemTotal;

                    return { product, quantity: item.quantity, unit_price: product.price };
                }),
            );

            const order = this.orderRepository.create({
                user,
                total_amount: totalAmount,
                status: OrderStatus.PENDING,
                orderItems,
            });
            return await this.orderRepository.save(order);
        } catch (error) {
            this.logger.error(`Failed to place order: ${error.message}`);
            throw new InternalServerErrorException('Could not retrieve top-ranking users');
        }
    }

    async cancelOrder(user: ICurrentUser, cancelOrderDto: CancelOrderDto): Promise<Order> {
        
        try {
            const { orderId } = cancelOrderDto;
            const order = await this.orderRepository.findOne({
                where: { id: orderId, user: { id: parseInt(user.userId) } },
                relations: ['orderItems'],
            });
            if (!order) throw new NotFoundException(`Order not found for this user`);

            if (order.status === OrderStatus.CANCELLED) {
                throw new BadRequestException('Order is already cancelled');
            }

            order.status = OrderStatus.CANCELLED;
            await this.orderRepository.save(order);
            
            return order;
        } catch (error) {
            this.logger.error(`Failed to cancel order: ${error.message}`);
            throw new InternalServerErrorException('Can not cancel order now');
        }
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
