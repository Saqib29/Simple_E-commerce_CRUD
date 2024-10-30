import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/utils/jwt/gql-auth.guard';
import { PaginationDto } from 'src/utils/common/pagination';

@Resolver(() => Product)
export class ProductResolver {
    constructor(private productService: ProductService) {}

    @Query(() => [Product])
    async allProducts(@Args('pagination') pagination: PaginationDto): Promise<Product[]> {
        return this.productService.findAllProducts(pagination);
    }

    @Query(() => Product)
    async product(@Args('id', { type: () => ID }) id: string): Promise<Product> {
        return this.productService.findOne(id);
    }

    @Mutation(() => Product)
    @UseGuards(GqlAuthGuard)
    async createProduct(
      @Args('name') name: string,
      @Args('category') category: string,
      @Args('price') price: number,
    ): Promise<Product> {
      return this.productService.create(name, category, price);
    }

    @Mutation(() => Product)
    @UseGuards(GqlAuthGuard)
    async updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('name') name: string,
    @Args('category') category: string,
    @Args('price') price: number,
    ): Promise<Product> {
    return this.productService.update(id, name, category, price);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async deleteProduct(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        return this.productService.remove(id);
    }
}
