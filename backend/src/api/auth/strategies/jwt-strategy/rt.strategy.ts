import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import {Request} from 'express'
import { Injectable } from '@nestjs/common';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'default_secret_key',
            passReqToCallback: true,
        });
    }

    validate(req : Request, payload: any): unknown {
        const authHeader = req.get('Authorization') || '';
        const refreshToken = authHeader.replace('Bearer', '').trim();
        return { ...payload, refreshToken };
    }
}