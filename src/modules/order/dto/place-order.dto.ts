import { Field, Float, InputType } from '@nestjs/graphql';
import { IsArray, IsNumber, IsPositive, Min } from 'class-validator';

@InputType()
export class PlaceOrderDto {
    @Field(() => [OrderItemInput])
    @IsArray()
    items: OrderItemInput[];

    @Field(() => Float)
    @IsNumber()
    @IsPositive()
    totalAmount: number;
}

@InputType()
export class OrderItemInput {
    @Field()
    @IsNumber()
    productId: number;

    @Field()
    @IsNumber()
    @Min(1)
    quantity: number;
}
