import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Product } from "src/product/product.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => User, user => user.orders)
    @Field(() => User)
    user: User;

    @ManyToOne(() => Product, product => product.orders)
    @Field(() => Product)
    product: Product;

    @Column()
    @Field()
    quantity: number;

    @Column()
    @Field()
    status: string;
}