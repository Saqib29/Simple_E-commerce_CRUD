import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { paginate } from 'src/utils/common/pagination';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async findAll(page: number, limit: number): Promise<Product[]> {
        const queryBuilder = this.productRepository.createQueryBuilder('product');
        return paginate(queryBuilder, page, limit);
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
