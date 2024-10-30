import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Pagination, PaginationDto } from 'src/utils/common/pagination';

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
                take: limit,
                order: { id: 'ASC' }
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

    async create(name: string, category: string, price: number): Promise<Product> {
        // const product = this.productRepository.create({ name, category, price });
        // return this.productRepository.save(product);
        return new Product();
    }

    async update(id: string, name: string, category: string, price: number): Promise<Product> {
        // return await this.productRepository.save({ id, name, category, price });
        return new Product();
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.productRepository.delete(id);
        return result.affected > 0;
    }
}
