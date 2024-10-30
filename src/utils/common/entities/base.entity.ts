import { Field, ID, ObjectType } from "@nestjs/graphql";
import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
export abstract class BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}