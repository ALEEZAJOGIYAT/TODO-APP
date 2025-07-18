import { Pool } from 'mysql2/promise';
import { connect } from '../database';

export interface Migration {
    up(connection: Pool): Promise<void>;
    down(connection: Pool): Promise<void>;
}

export class MigrationRunner {
    private connection: Pool;

    constructor(connection: Pool) {
        this.connection = connection;
    }

    async createMigrationsTable(): Promise<void> {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                migration_name VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await this.connection.execute(createTableSQL);
    }

    async runMigration(migrationName: string, migration: Migration): Promise<void> {
        await this.createMigrationsTable();
        
        // Check if migration already ran
        const [rows] = await this.connection.execute(
            'SELECT * FROM migrations WHERE migration_name = ?',
            [migrationName]
        );
        
        if ((rows as any[]).length > 0) {
            console.log(`Migration ${migrationName} already executed`);
            return;
        }

        // Run the migration
        await migration.up(this.connection);
        
        // Record the migration
        await this.connection.execute(
            'INSERT INTO migrations (migration_name) VALUES (?)',
            [migrationName]
        );
        
        console.log(`Migration ${migrationName} executed successfully`);
    }

    async rollbackMigration(migrationName: string, migration: Migration): Promise<void> {
        // Run the rollback
        await migration.down(this.connection);
        
        // Remove from migrations table
        await this.connection.execute(
            'DELETE FROM migrations WHERE migration_name = ?',
            [migrationName]
        );
        
        console.log(`Migration ${migrationName} rolled back successfully`);
    }
}

export async function runMigrations(): Promise<void> {
    const connection = await connect();
    const runner = new MigrationRunner(connection);
    
    // Import and run migrations
    const { createUsersTable } = await import('./001_create_users_table');
    const { createTodosTable } = await import('./002_create_todos_table');
    
    await runner.runMigration('001_create_users_table', createUsersTable);
    await runner.runMigration('002_create_todos_table', createTodosTable);
    
    await connection.end();
    console.log('All migrations completed');
}