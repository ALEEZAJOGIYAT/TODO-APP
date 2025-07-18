import { Request, Response, NextFunction } from 'express';
import { JwtHelper, JwtPayload } from '../utils/jwtHelper';

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
        const token = JwtHelper.extractTokenFromHeader(req.headers.authorization);
        const decoded = JwtHelper.verifyToken(token);
        
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
        if (req.headers.authorization) {
            const token = JwtHelper.extractTokenFromHeader(req.headers.authorization);
            const decoded = JwtHelper.verifyToken(token);
            req.user = decoded;
        }
        next();
    } catch (error) {
        // For optional auth, we don't fail if token is invalid, just continue without user
        next();
    }
};