import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from 'src/utils/jwt/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwt_config } from 'src/app-config-module/config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwt_config.secret,
      signOptions: { expiresIn: jwt_config.expires },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy]
})
export class AuthModule {}
