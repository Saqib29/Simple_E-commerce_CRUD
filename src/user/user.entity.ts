import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Order } from "src/order/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column({ unique: true })
    @Field()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Order, order => order.user)
    @Field(() => [Order], { nullable: true })
    orders: Order[];
}