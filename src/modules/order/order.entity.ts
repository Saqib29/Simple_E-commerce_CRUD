import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Product } from "src/modules/product/product.entity";
import { User } from "src/modules/user/user.entity";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => User, user => user.orders)
    @Index()
    @Field(() => User)
    user: User;

    @ManyToOne(() => Product, product => product.orders)
    @Index()
    @Field(() => Product)
    product: Product;

    @Column()
    @Field()
    quantity: number;

    @Column()
    @Index()
    @Field()
    status: string;
}