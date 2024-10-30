import { Args,Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { PaginationDto } from 'src/utils/common/pagination';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/utils/jwt/gql-auth.guard';
import { CurrentUser } from 'src/utils/decorator/current-user.decorator';
import { ICurrentUser } from 'src/utils/interface/currentUser.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver(() => User)
export class UserResolver {
    constructor(private userService: UserService){}

    @Query(() => [User], { name: 'allUsersWithOrders' })
    async allUsersWithOrders(@Args('pagination') pagination: PaginationDto): Promise<User[]> {
        return this.userService.findAllUsers(pagination);
    }

    @Query(() => User, { name: 'getUserById' })
    async getUserById(@Args('id', { type: () => Int }) id: number): Promise<User> {
        return this.userService.findById(id);
    }

    @Query(() => User, { name: 'getUserByEmail' })
    async getUserByEmail(@Args('email', { type: () => String }) email: string): Promise<User | null> {
        return this.userService.findByEmail(email);
    }

    @Mutation(() => User)
    @UseGuards(GqlAuthGuard)
    async updateUser(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('updateUserDto') updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.updateUser(currentUser, updateUserDto);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async deactivateUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        return this.userService.deactivateUser(id);
    }
}
