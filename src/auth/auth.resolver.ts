import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from 'src/utils/types/auth-payload';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService){}

    @Mutation(() => String)
    async singin(
        @Args('email') email: string,
        @Args('password') password: string,
    ) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new Error('Invalid credentials')
        }
        return this.authService.signIn(user);
    }

    @Mutation(() => AuthPayload)
    async signup(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<AuthPayload> {
        return this.authService.signUp(email, password);
    }
}