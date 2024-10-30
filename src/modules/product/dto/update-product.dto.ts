import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ProductCategory } from "src/utils/types/enums";

@InputType()
export class UpdateProductDto {
    @Field(() => Int)
    @IsNumber()
    id: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsPositive()
    price?: number;

    @Field(() => ProductCategory, { nullable: true })
    @IsOptional()
    @IsEnum(ProductCategory)
    category?: ProductCategory;
}
