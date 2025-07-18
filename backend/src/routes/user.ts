import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { UserController } from '../controller/UserController';

export function createUserRoutes(db: Pool): Router {
    const router = Router();
    const userController = new UserController(db);

    // Public routes
    router.post('/signup', userController.signup);
    router.post('/login', userController.login);
    return router;
}