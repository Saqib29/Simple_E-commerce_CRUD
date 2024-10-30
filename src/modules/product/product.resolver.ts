import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/utils/jwt/gql-auth.guard';
import { PaginationDto } from 'src/utils/common/pagination';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
      @Args('createProductDto') createProductDto: CreateProductDto
    ): Promise<Product> {
      return this.productService.createProduct(createProductDto);
    }

    @Mutation(() => Product)
    @UseGuards(GqlAuthGuard)
    async updateProduct(
      @Args('updateProductDto') updateProductDto: UpdateProductDto,
    ): Promise<Product> {
    return this.productService.updateProduct(updateProductDto);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async deleteProduct(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        return this.productService.remove(id);
    }
}
