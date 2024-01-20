import fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import fastifyEnv from "@fastify/env";
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnection from "./plugins/dbConnection.js";
import { MongoDbManager } from "./plugins/MongoDbManager.js";
import dbManager from "./plugins/dbManager.js";
const envSchema = {
    type: 'object',
    required: ['PORT', 'DB_URL', 'DB_NAME'],
    properties: {
        PORT: {
            type: 'string',
            default: '3000'
        },
        DB_URL: {
            type: 'string',
            default: 'mongodb://localhost:27017'
        },
        DB_NAME: {
            type: 'string',
            default: 'mydb'
        }
    }
};
async function buildServer() {
    const app = fastify({ logger: true });
    await app.register(fastifyEnv, {
        confKey: 'config',
        schema: envSchema,
        dotenv: true,
    });
    await app.after();
    const config = app.config;
    const mongoConfig = {
        type: 'mongodb',
        config: {
            url: config.DB_URL,
            database: config.DB_NAME
        }
    };
    try {
        await app.register(dbConnection, [
            mongoConfig
        ]);
        app.log.info('Successfully connected to the database');
    }
    catch (error) {
        app.log.error('Failed to connect to the database', error);
        throw error;
    }
    const mongoDbManager = new MongoDbManager(app);
    await app.register(dbManager, { dbClient: mongoDbManager });
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    app.register(autoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: { prefix: '/api' },
    });
    return app;
}
export default buildServer;
//# sourceMappingURL=server.js.map