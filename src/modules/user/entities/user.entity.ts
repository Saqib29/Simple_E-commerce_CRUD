import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Order } from "src/modules/order/entities/order.entity";
import { BaseEntity } from "src/utils/common/entities/base.entity";
import { Role, UserStatus } from "src/utils/types/enums";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
    @Field()
    @Column()
    @Index('idx_users_email', { unique: true })
    email: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    password: string;

    @Field(() => Role)
    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @Field(() => UserStatus)
    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Field(() => [Order], { nullable: true })
    @OneToMany(() => Order, order => order.user)
    orders: Order[];
}