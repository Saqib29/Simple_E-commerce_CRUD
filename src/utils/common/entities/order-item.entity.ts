import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/utils/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Order } from "../../../modules/order/entities/order.entity";
import { Product } from "../../../modules/product/entities/product.entity";

@ObjectType()
@Entity('order_items')
export class OrderItem extends BaseEntity {
    @Field(() => Order)
    @ManyToOne(() => Order, order => order.orderItems)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Field(() => Product)
    @ManyToOne(() => Product, product => product.orderItems)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Field()
    @Column()
    quantity: number;

    @Field()
    @Column('decimal', { precision: 10, scale: 2 })
    unit_price: number;
}