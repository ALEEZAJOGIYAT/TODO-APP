import { Pool } from 'mysql2/promise';
import { Migration } from './migrationRunner';

export const createUsersTable: Migration = {
    async up(connection: Pool): Promise<void> {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                token VARCHAR(255) NOT NULL,
                contact_no VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        await connection.execute(createTableSQL);
        console.log('Users table created successfully');
    },

    async down(connection: Pool): Promise<void> {
        await connection.execute('DROP TABLE IF EXISTS users');
        console.log('Users table dropped successfully');
    }
};