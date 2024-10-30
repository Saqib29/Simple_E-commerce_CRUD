import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class SignUpDto {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    @MinLength(6)
    password: string;
}