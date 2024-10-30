import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponseDto } from 'src/modules/auth/dto/auth-payload.dto';
import { Response } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService){}

    @Mutation(() => AuthResponseDto)
    async signin(
        @Args('signInDto') signInDto: SignInDto,
        @Context() context: { res: Response }
    ): Promise<AuthResponseDto> {
        try {
            return await this.authService.signIn(signInDto, context.res);
        } catch (error) {
            throw new BadRequestException(error.message || 'Sign-in failed');
        }
    }

    @Mutation(() => AuthResponseDto)
    async signup(
        @Args('signUpDto') signUpDto: SignUpDto,
        @Context() context: { res: Response } 
    ): Promise<AuthResponseDto> {
        try {
            return await this.authService.signUp(signUpDto, context.res);
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Sign-up failed');
        }
    }
}