import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class CancelOrderDto {
    @Field()
    @IsNumber()
    orderId: number;
}