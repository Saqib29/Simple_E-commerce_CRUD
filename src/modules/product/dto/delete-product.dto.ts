import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class DeleteProductDto {
    @Field()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}