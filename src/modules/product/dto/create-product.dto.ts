import { Field, Float, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ProductCategory } from "src/utils/types/enums";

@InputType()
export class CreateProductDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field(() => Float)
    @IsNumber()
    @IsPositive()
    price: number;

    @Field(() => ProductCategory)
    @IsEnum(ProductCategory)
    category: ProductCategory;
}
