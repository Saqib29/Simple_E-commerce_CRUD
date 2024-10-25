import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from 'src/utils/types/auth-payload';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService){}

    @Mutation(() => AuthPayload)
    async signin(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context() context: { res: Response }
    ): Promise<AuthPayload> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new Error('Invalid credentials')
        }
        return this.authService.signIn(user, context.res);
    }

    @Mutation(() => AuthPayload)
    async signup(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context() context: { res: Response } 
    ): Promise<AuthPayload> {
        return this.authService.signUp(email, password, context.res);
    }
}