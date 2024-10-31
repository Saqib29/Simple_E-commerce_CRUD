import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { app_config, jwt_config } from 'src/app-config-module/config';
import { faker } from '@faker-js/faker';
import { OrderStatus, ProductCategory, Role, UserStatus } from 'src/utils/types/enums';

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
    await this.createSeedingLogTable();
    const isSeeded = await this.checkIfSeeded()
    if (!isSeeded && app_config.run_seed === 'true') {
      console.log('Running Seeder...');
      await this.seedUsers();
      await this.seedProducts();
      await this.seedOrders(); 
      console.log('Seeding Completed!');
    }
  }

  private async seedUsers() {
    const hashedPassword = await bcrypt.hash('123', parseInt(jwt_config.salt));
    const users = []; 
    for (let i = 0; i < 1000; i++) {
        users.push({
            created_at: new Date(),
            email: `user${i}@example.com`,
            name: faker.internet.username(), // `User ${i}`,
            password: hashedPassword,
            role: 'user', 
            status: 'ACTIVE' 
        });
    }
    await this.userRepository.save(users);
  }

  private async seedProducts() {
    const products = Array.from({ length: 1000 }).map(() => {
      const product = new Product();
      product.name = faker.commerce.productName();
      product.price = parseFloat(faker.commerce.price());
      product.category = faker.helpers.arrayElement(Object.values(ProductCategory));
      return product;
    });

    await this.productRepository.save(products);
  } 

  private async seedOrders() {
    const users = await this.userRepository.find({ take: 1000 });

    const orders = [];
    for (let i = 0; i < 1000; i++) {
      const order = new Order();
      order.user = users[i];
      order.total_amount = parseFloat(faker.commerce.price());
      order.status = 'PENDING';
      orders.push(order);
    }

    await this.orderRepository.save(orders);
  }


  private async createSeedingLogTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS seeding_log (
        id SERIAL PRIMARY KEY,
        seeding_type VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await this.dataSource.query(query);
  }

  private async checkIfSeeded(): Promise<boolean> {
    const result = await this.dataSource.query(`
      SELECT COUNT(*) AS count FROM seeding_log WHERE seeding_type = 'ALL'
    `);
    return result[0].count > 0; // Return true if there's at least one record
  }
}
