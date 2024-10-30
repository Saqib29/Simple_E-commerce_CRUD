import { Args, ID, Int, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { PaginationDto } from 'src/utils/common/pagination';

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

    async getUserByEmail(@Args('email', { type: () => String }) email: string): Promise<User | null> {
        return this.userService.findByEmail(email);
    }
}
