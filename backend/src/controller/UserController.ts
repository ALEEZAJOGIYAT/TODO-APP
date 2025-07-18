import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserService } from '../services/UserService';
import { SignupRequest, LoginRequest } from '../model/User';

export class UserController {
    private userService: UserService;

    constructor(db: Pool) {
        this.userService = new UserService(db);
    }

    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const signupData: SignupRequest = req.body;

            // Basic validation
            if (!signupData.name || !signupData.email || !signupData.password) {
                res.status(400).json({
                    success: false,
                    message: 'Name, email, and password are required'
                });
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(signupData.email)) {
                res.status(400).json({
                    success: false,
                    message: 'Please provide a valid email address'
                });
                return;
            }

            // Password strength validation
            if (signupData.password.length < 6) {
                res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters long'
                });
                return;
            }

            const result = await this.userService.signup(signupData);

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: result
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create user'
            });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const loginData: LoginRequest = req.body;

            // Basic validation
            if (!loginData.email || !loginData.password) {
                res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
                return;
            }

            const result = await this.userService.login(loginData);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Login failed'
            });
        }
    };

}