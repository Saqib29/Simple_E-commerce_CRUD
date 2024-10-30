import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/modules/user/entities/user.entity";
import { OrderItem } from "src/utils/common/entities/order-item.entity";
import { BaseEntity } from "src/utils/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@ObjectType()
@Entity('orders')
export class Order extends BaseEntity {
    @Field(() => User)
    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Field()
    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    @Column()
    @Field()
    status: boolean;

    @Field(() => [OrderItem])
    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
    orderItems: OrderItem[];
}