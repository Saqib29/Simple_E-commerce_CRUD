import { ConflictException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from 'src/modules/auth/dto/auth-payload.dto';
import { Response } from 'express';
import { JWT_OPTIONS } from 'src/utils/common/jwt-option';
import { jwt_config } from 'src/app-config-module/config';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string): Promise<any> {
        try {
            const user = await this.userService.findByEmail(email);
            if (user && await bcrypt.compare(password, user.password)) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            this.logger.error(`Error validating user: ${error.message}`);
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async signIn(signInDto: SignInDto, res: Response): Promise<AuthResponseDto> {
        const user = await this.validateUser(signInDto.email, signInDto.password);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        try {
            const payload = { email: user.email, id: user.id };
            const token = this.jwtService.sign(payload);
            res.cookie('jwt', token, JWT_OPTIONS)
            this.logger.debug('cookie set successfully');
            
            return { access_token: token }; 
        } catch (error) {
            this.logger.error(`Error during sign-in: ${error.message}`);
            throw new InternalServerErrorException('Failed to generate access token');
        }
    }

    async signUp(signUpDto: SignUpDto, res: Response): Promise<AuthResponseDto> {
        const { name, email, password } = signUpDto;

        try {
            const existingUser = await this.userService.findByEmail(email);
            if (existingUser) throw new ConflictException('This email already exists!');

            const hashedPassword = await bcrypt.hash(password, parseInt(jwt_config.salt));
            const user = await this.userService.createUser(name, email, hashedPassword);

            return await this.signIn({email, password}, res);
        } catch (error) {
            this.logger.error(`Error in sign-up: ${error.message}`);
            throw new InternalServerErrorException('Sign-up failed');
        }

        
    }
}
