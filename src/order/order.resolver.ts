import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { GqlAuthGuard } from 'src/utils/jwt/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { TopUserDto, TotalSalesPerCategoryDto } from 'src/utils/types/types';
import { CurrentUser } from 'src/utils/decorator/current-user.decorator';
import { CurrentUserPayload } from 'src/utils/interface/currentUser.interface';

@Resolver(() => Order)
export class OrderResolver {
    constructor(private orderService: OrderService) {}

    @Mutation(() => Order)
    @UseGuards(GqlAuthGuard)
    async createOrder(
    @CurrentUser() user: CurrentUserPayload,
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
    async userOrders(@Args('userId', { type: () => ID }) userId: string): Promise<Order[]> {
        return this.orderService.findByUser(userId);
    }

    @Query(() => [TotalSalesPerCategoryDto])
    @UseGuards(GqlAuthGuard)
    async totalSalesPerCategory(): Promise<TotalSalesPerCategoryDto[]> {
        return this.orderService.getTotalSalesPerCategory();
    }

    @Query(() => [TopUserDto])
    @UseGuards(GqlAuthGuard)
    async topUsers(): Promise<TopUserDto[]> {
        return this.orderService.getTopUsers();
    }
}
