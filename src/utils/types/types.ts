import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TotalSalesPerCategoryDto {
  @Field()
  category: string;

  @Field(() => Float)
  totalSales: number;
}

@ObjectType()
export class TopUserDto {
  @Field(() => String)
  userId: number;

  @Field()
  userEmail: string;

  @Field(() => Int)
  orderCount: number;
}