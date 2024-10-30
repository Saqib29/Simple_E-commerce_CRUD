import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ProductCategory } from 'src/utils/types/enums';

@ObjectType()
export class SalesPerCategoryDto {
    @Field(() => ProductCategory)
    category: ProductCategory;

    @Field(() => Float)
    totalSales: number;
}
