import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { GqlAuthGuard } from 'src/utils/jwt/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { TopUserDto, TotalSalesPerCategoryDto } from 'src/utils/types/types';
import { CurrentUser } from 'src/utils/decorator/current-user.decorator';
import { ICurrentUser } from 'src/utils/interface/currentUser.interface';
import { UserRankingDto } from './dto/user-ranking.dto';

@Resolver(() => Order)
export class OrderResolver {
    constructor(private orderService: OrderService) {}

    @Mutation(() => Order)
    @UseGuards(GqlAuthGuard)
    async createOrder(
    @CurrentUser() user: ICurrentUser,
    @Args('productId', { type: () => ID }) productId: string,
    @Args('quantity') quantity: number,
    ): Promise<Order> {
        return this.orderService.create(user.userId, productId, quantity);
    }

    @Mutation(() => Order)
    @UseGuards(GqlAuthGuard)
    async cancelOrder(@Args('id', { type: () => ID }) id: string): Promise<Order> {
        return this.orderService.cancel(id);
    }

    @Query(() => [Order])
    @UseGuards(GqlAuthGuard)
    async userOrders(@CurrentUser() user: ICurrentUser): Promise<Order[]> {
        return this.orderService.findByUser(user.userId);
    }


    async getTopRankingUsers(
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number
    ): Promise<UserRankingDto[]> {
        return this.orderService.getTopRankingUsers(limit);
    }
}