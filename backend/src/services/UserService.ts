import { Pool, RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { User, UserResponse, LoginRequest, SignupRequest, AuthResponse } from '../model/User';
import { JwtHelper } from '../utils/jwtHelper';

export class UserService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async signup(signupData: SignupRequest): Promise<AuthResponse> {
        const { name, email, password, contact_no } = signupData;

        // Check if user already exists
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const [result] = await this.db.execute(
            'INSERT INTO users (name, email, password, contact_no) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, contact_no || null]
        );

        const insertId = (result as any).insertId;
        const newUser = await this.findUserById(insertId);
        
        if (!newUser) {
            throw new Error('Failed to create user');
        }

        const userResponse = this.excludePassword(newUser);
        const token = JwtHelper.generateToken(userResponse);
        // Update user with token
        await this.db.execute(
            'UPDATE users SET token = ? WHERE id = ?',
            [token, insertId]
        );

        return {
            user: userResponse,
            token
        };
    }

    async login(loginData: LoginRequest): Promise<AuthResponse> {
        const { email, password } = loginData;

        // Find user by email
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const userResponse = this.excludePassword(user);
        const token = JwtHelper.generateToken(userResponse);

        // Update user with new token
        await this.db.execute(
            'UPDATE users SET token = ? WHERE id = ?',
            [token, user.id]
        );

        return {
            user: userResponse,
            token
        };
    }

    async findUserById(id: number): Promise<User | null> {
        const [rows] = await this.db.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );

        const users = rows as RowDataPacket[];
        return users.length > 0 ? users[0] as User : null;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const [rows] = await this.db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const users = rows as RowDataPacket[];
        return users.length > 0 ? users[0] as User : null;
    }


    private excludePassword(user: User): UserResponse {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as UserResponse;
    }
}