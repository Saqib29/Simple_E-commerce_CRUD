import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Pagination, PaginationDto } from 'src/utils/common/pagination';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { OrderItem } from 'src/utils/common/entities/order-item.entity';
import { SalesPerCategoryDto } from './dto/sales-per-category.dto';
import { ProductCategory } from 'src/utils/types/enums';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) {}

    async findAllProducts(pagination: PaginationDto): Promise<Product[]> {
        const { skip, limit } = Pagination.paginate(pagination.page, pagination.limit);

        try {
            return this.productRepository.find({
                skip,
                take: limit
            });
        } catch (error) {
            this.logger.error(`Error finding all products: ${error.message}`);
            throw new BadRequestException('Could not retrieve products');
        }
        
    }

    async getTotalSalesPerCategory(): Promise<SalesPerCategoryDto[]> {
        try {
            const result = await this.orderItemRepository
                .createQueryBuilder('orderItem')
                .select('SUM(orderItem.unit_price * orderItem.quantity)', 'totalSales')
                .addSelect('product.category', 'category')
                .innerJoin('orderItem.product', 'product')
                .groupBy('product.category')
                .getRawMany();

            return result.map(item => ({
                category: item.category as ProductCategory,
                totalSales: parseFloat(item.totalSales),
            }));
        } catch (error) {
            this.logger.error(`Failed to get total sales per category: ${error.message}`);
            throw new InternalServerErrorException('Could not retrieve total sales per category');
        }
    }

    async createProduct(createProductDto: CreateProductDto): Promise<Product>{
        try {
            const newProduct = this.productRepository.create(createProductDto);
            return await this.productRepository.save(newProduct);
        } catch (error) {
            this.logger.error(`Failed to create product: ${error.message}`);
            throw new InternalServerErrorException('Could not create product');
        }
    }

    async updateProduct(updateProductDto: UpdateProductDto): Promise<Product> {
        try {
            const product = await this.productRepository.findOne({ where: { id: updateProductDto.id } });
            if (!product) throw new NotFoundException(`Product not found`);

            return await this.productRepository.save(product);
        } catch (error) {
            this.logger.error(`Failed to update the product: ${error.message}`);
            throw new InternalServerErrorException('Could not update product');
        }
    }

    async deleteProduct(deleteProductDto: DeleteProductDto): Promise<boolean> {
        try {
            const product = await this.productRepository.findOne({ 
                where: { id: deleteProductDto.id } 
            });
            if (!product) {
                throw new NotFoundException(`Product not found`);
            }
            await this.productRepository.remove(product);
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete product ${deleteProductDto.id}: ${error.message}`);
            throw new InternalServerErrorException('Could not delete product');
        }
    }
}
