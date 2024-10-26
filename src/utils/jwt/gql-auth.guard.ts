import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(GqlAuthGuard.name);
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();

        if (req?.cookies?.jwt) {
            req.headers.authorization = `Bearer ${req.cookies.jwt}`;
        } else {
            this.logger.debug('No JWT cookie found');
        }

        return req;
    } 
}