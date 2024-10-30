import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Pagination, PaginationDto } from 'src/utils/common/pagination';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
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

    async findOne(id: string): Promise<Product> {
        // return this.productRepository.findOne({ where: { id } });
        return new Product()
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

    async remove(id: string): Promise<boolean> {
        const result = await this.productRepository.delete(id);
        return result.affected > 0;
    }
}
