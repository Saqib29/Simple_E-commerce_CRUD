import { CookieOptions } from "express";

export const JWT_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60 * 1000, //24 * 60 * 60 * 1000,
    path: '/',
}