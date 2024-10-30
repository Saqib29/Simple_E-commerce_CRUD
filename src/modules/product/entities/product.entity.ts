import { Field, Float, ObjectType, registerEnumType } from "@nestjs/graphql";
import { OrderItem } from "src/utils/common/entities/order-item.entity";
import { BaseEntity } from "src/utils/common/entities/base.entity";
import { ProductCategory } from "src/utils/types/enums";
import { Column, Entity, Index, OneToMany } from "typeorm";


@ObjectType()
@Entity('products')
export class Product extends BaseEntity {
    @Column()
    @Field()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    @Field(() => Float)
    price: number;

    @Field(() => ProductCategory)
    @Column({ type: 'enum', enum: ProductCategory })
    @Index('idx_products_category')
    category: ProductCategory;

    @Field(() => [OrderItem], { nullable: true })
    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItems: OrderItem[];
}