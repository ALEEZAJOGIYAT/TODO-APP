#!/usr/bin/env ts-node

import { runMigrations } from './migrationRunner';

async function main() {
    try {
        console.log('Starting database migrations...');
        await runMigrations();
        console.log('Database migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

main();