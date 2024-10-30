import { CookieOptions } from "express";
import { app_config } from "src/app-config-module/config";

export const JWT_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: app_config.node_env === 'production',
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
}