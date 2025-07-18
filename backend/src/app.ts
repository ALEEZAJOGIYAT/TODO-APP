import express, { Application } from 'express'
import morgan from 'morgan'
import { Pool } from 'mysql2/promise'

// Routes
import IndexRoutes from './routes'
import { createUserRoutes } from './routes/user'
import { createTodoRoutes } from './routes/todo'

export class App {
    app: Application;
    private db?: Pool;

    constructor(
        private port?: number | string
    ) {
        this.app = express();
        this.settings();
        this.middlewares();
    }

    setDatabase(db: Pool) {
        this.db = db;
        this.routes();
    }

    private settings() {
        this.app.set('port', this.port || process.env.PORT || 3000);
    }

    private middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes() {
        if (!this.db) {
            throw new Error('Database connection not set');
        }

        this.app.use('/', IndexRoutes); //for testing the app and all
        this.app.use('/api/users', createUserRoutes(this.db));
        this.app.use('/api/todos', createTodoRoutes(this.db));
    }

    async listen(): Promise<void> {
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }

}