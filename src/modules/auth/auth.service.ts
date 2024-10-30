import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthPayload } from 'src/utils/types/auth-payload';
import { Response } from 'express';
import { JWT_OPTIONS } from 'src/utils/common/jwt.option';
import { jwt_config } from 'src/app-config-module/config';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
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

    async signIn(user: any, res: Response): Promise<AuthPayload> {
        const payload = { email: user.email, sub: user.id };
        const token = this.jwtService.sign(payload);

        res.cookie('jwt', token, JWT_OPTIONS)
        this.logger.debug('cookie set successfully');
        
        return { access_token: token }; 
    }

    async signUp(email: string, password: string, res: Response): Promise<AuthPayload> {
        const hashedPassword = await bcrypt.hash(password, parseInt(jwt_config.salt));
        const user = await this.userService.create(email, hashedPassword);

        return this.signIn(user, res);
    }
}
