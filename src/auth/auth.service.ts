import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthPayload } from 'src/utils/types/auth-payload';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return user;
        }
        return null;
    }

    async signIn(user: any): Promise<AuthPayload> {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    async signUp(email: string, password: string): Promise<AuthPayload> {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT));
        const user = await this.userService.create(email, hashedPassword);

        return this.signIn(user);
    }
}
