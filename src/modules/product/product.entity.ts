import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { Order } from "src/modules/order/order.entity";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    @Field()
    name: string;

    @Column()
    @Index()
    @Field()
    category: string;

    @Column('decimal')
    @Field(() => Float)
    price: number;

    @OneToMany(() => Order, order => order.product)
    orders: Order[];
}