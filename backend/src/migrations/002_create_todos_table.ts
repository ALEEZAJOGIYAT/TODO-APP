import { Pool } from 'mysql2/promise';
import { Migration } from './migrationRunner';

export const createTodosTable: Migration = {
    async up(connection: Pool): Promise<void> {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS todos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item VARCHAR(255) NOT NULL,
                description TEXT,
                due_date DATE,
                user_id INT,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await connection.execute(createTableSQL);
        console.log('Todos table created successfully');
    },

    async down(connection: Pool): Promise<void> {
        await connection.execute('DROP TABLE IF EXISTS todos');
        console.log('Todos table dropped successfully');
    }
};