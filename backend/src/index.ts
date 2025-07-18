import { App } from './app'
import { connect } from './database'


async function main() {
    const app = new App(5000);
    const connection = await connect();
    
    // Set database connection to app
    app.setDatabase(connection);
    
    console.log('Database connected');
    await app.listen();
}

main().catch(console.error);