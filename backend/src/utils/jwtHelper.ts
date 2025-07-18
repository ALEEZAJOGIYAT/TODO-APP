import jwt from 'jsonwebtoken';
import { UserResponse } from '../model/User';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'staging';
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || 3600;

export interface JwtPayload {
    userId: number;
    email: string;
}

export class JwtHelper {
    static generateToken(user: UserResponse): string {
        const payload: JwtPayload = {
            userId: user.id,
            email: user.email
        };

        return jwt.sign(payload, JWT_SECRET, {
            issuer: 'todo-app',
            subject: user.id.toString()
        });
    }

    static verifyToken(token: string): JwtPayload {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
            return decoded;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    static extractTokenFromHeader(authHeader: string | undefined): string {
        if (!authHeader) {
            throw new Error('No authorization header provided');
        }

        if (!authHeader.startsWith('Bearer ')) {
            throw new Error('Invalid authorization header format');
        }

        return authHeader.substring(7); // Remove 'Bearer ' prefix
    }
}