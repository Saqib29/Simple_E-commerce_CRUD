import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';
import { Order } from 'src/order/order.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.createSeederTableIfNotExists();
    const alreadySeeded = await this.isSeeded();

    if (!alreadySeeded && process.env.RUN_SEED === 'true') {
      console.log('Running Seeder...');
      await this.seedUsers();
      await this.seedProducts();
      await this.seedOrders();
      await this.markAsSeeded();
      console.log('Seeding Completed!');
    }
  }

  private async createSeederTableIfNotExists() {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS seeder_status (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        completed BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);
  }

  private async isSeeded(): Promise<boolean> {
    const result = await this.dataSource.query(
      `SELECT completed FROM seeder_status WHERE name = 'default_seed' LIMIT 1`
    );
    return result[0]?.completed === true;
  }

  private async markAsSeeded() {
    await this.dataSource.query(
      `INSERT INTO seeder_status (name, completed)
       VALUES ('default_seed', TRUE)
       ON CONFLICT (name)
       DO UPDATE SET completed = TRUE;`
    );
  }
 
  private async seedUsers() {
    const batchSize = 100;
    const totalRecords = 1000;

    for (let i = 0; i < totalRecords; i += batchSize) {
      const users = Array.from({ length: batchSize }, (_, j) => {
        const user = new User();
        user.email = `user${i + j}@example.com`;
        user.password = bcrypt.hashSync('password', 10);
        return user;
      });
      await this.userRepository.save(users);
      console.log(`Inserted ${i + batchSize} / ${totalRecords} users`);
    }
  }

  private async seedProducts() {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
    const batchSize = 100;
    const totalRecords = 1000;

    for (let i = 0; i < totalRecords; i += batchSize) {
      const products = Array.from({ length: batchSize }, (_, j) => {
        const product = new Product();
        product.name = `Product ${i + j}`;
        product.category = categories[Math.floor(Math.random() * categories.length)];
        product.price = Math.random() * 1000;
        return product;
      });
      await this.productRepository.save(products);
      console.log(`Inserted ${i + batchSize} / ${totalRecords} products`);
    }
  }

  private async seedOrders() {
    const users = await this.userRepository.find();
    const products = await this.productRepository.find();
    const batchSize = 100;
    const totalRecords = 1000;

    for (let i = 0; i < totalRecords; i += batchSize) {
      const orders = Array.from({ length: batchSize }, () => {
        const order = new Order();
        order.user = users[Math.floor(Math.random() * users.length)];
        order.product = products[Math.floor(Math.random() * products.length)];
        order.quantity = Math.floor(Math.random() * 10) + 1;
        order.status = Math.random() > 0.8 ? 'CANCELLED' : 'COMPLETED';
        return order;
      });
      await this.orderRepository.save(orders);
      console.log(`Inserted ${i + batchSize} / ${totalRecords} orders`);
    }
  }
}