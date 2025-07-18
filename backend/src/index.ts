import 'dotenv/config';
import { App } from './app'
import { connect } from './database'


async function main() {
    const port = parseInt(process.env.PORT || '5000');
    const app = new App(port);
    const connection = await connect();
    
    // Set database connection to app
    app.setDatabase(connection);
    
    console.log('Database connected');
    await app.listen();
}

main().catch(console.error);