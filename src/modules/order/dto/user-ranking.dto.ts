import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';

@ObjectType()
export class UserRankingDto {
    @Field(() => User)
    user: User;

    @Field(() => Int)
    orderCount: number;
}
