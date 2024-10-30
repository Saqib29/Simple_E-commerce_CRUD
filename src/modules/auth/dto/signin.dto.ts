import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class SignInDto {
    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field()
    @MinLength(6)
    password: string;
}