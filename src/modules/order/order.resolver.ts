import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { GqlAuthGuard } from 'src/utils/jwt/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/utils/decorator/current-user.decorator';
import { UserRankingDto } from './dto/user-ranking.dto';
import { ICurrentUser } from 'src/utils/interface/currentUser.interface';
import { PlaceOrderDto } from './dto/place-order.dto';

@Resolver(() => Order)
export class OrderResolver {
    constructor(private orderService: OrderService) {}

    @Mutation(() => Order)
    @UseGuards(GqlAuthGuard)
    async placeOrder(
        @CurrentUser() user: ICurrentUser,
        @Args('placeOrderDto') placeOrderDto: PlaceOrderDto,
    ): Promise<Order> {
        return this.orderService.placeOrder(user.userId, placeOrderDto);
    }

    

    @Query(() => [UserRankingDto])
    async getTopRankingUsers(
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number
    ): Promise<UserRankingDto[]> {
        return this.orderService.getTopRankingUsers(limit);
    }
}