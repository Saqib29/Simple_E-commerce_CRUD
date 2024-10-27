import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwt_config } from "src/app-config-module/config";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (request: Request) => {
                    return request?.cookies?.jwt;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: jwt_config.secret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}