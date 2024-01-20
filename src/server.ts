import fastify from 'fastify';
import autoLoad from '@fastify/autoload'
import fastifyEnv from "@fastify/env";
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnection from "./plugins/dbConnection.js";
import {IEnvConfig} from "./types/IEnvConfig.js";
import {IMongoDBConfig, IDatabaseConfig} from "./types/IDatabaseConfig.js";
import { MongoDbManager } from "./plugins/MongoDbManager.js";
import dbManager from "./plugins/dbManager.js";

// Schema definition for the environment variables to be validated by fastify-env.
const envSchema = {
    type: 'object',
    required: ['PORT', 'DB_URL', 'DB_NAME'], // Specifies required environment variables.
    properties: {
        PORT: {
            type: 'string',
            default: '3000' // Default value for PORT if not specified in the environment.
        },
        DB_URL: {
            type: 'string',
            default: 'mongodb://localhost:27017'
        },
        DB_NAME: {
            type: 'string',
            default: 'mydb'
        }
        // Add additional environment variable definitions here.
    }
};

// Asynchronously builds and configures the Fastify server instance.
async function buildServer() {
    // Initializes the Fastify server with logging enabled.
    const app = fastify({ logger: true });

    // Registers the fastify-env plugin to load and validate environment variables.
    // The configuration is made accessible under 'app.config'.
    await app.register(fastifyEnv, {
        confKey: 'config', // Key under which the configuration is stored in the Fastify instance.
        schema: envSchema,
        dotenv: true, // Instructs fastify-env to load variables from a .env file.
    });

    // Await for the environment configuration to be loaded
    await app.after();

    // Assert the type of app.config
    const config = app.config as IEnvConfig;

    const mongoConfig: IDatabaseConfig<IMongoDBConfig> = {
        type: 'mongodb',
        config: {
            url: config.DB_URL,
            database: config.DB_NAME
        }
    }

    // Register dbConnection
    try {
        await app.register(dbConnection, [
            mongoConfig
        ]);
        app.log.info('Successfully connected to the database');
    } catch (error) {
        app.log.error('Failed to connect to the database', error);
        throw error; // rethrow the error to handle it outside
    }

    // Initialize and register MongoDbManager with dbManager
    const mongoDbManager = new MongoDbManager(app);
    await app.register(dbManager, { dbClient: mongoDbManager });

    // Derive the equivalent of __dirname in ECMAScript modules to locate the current directory.
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // Registers the fastify-autoload plugin to automatically load routes from the specified directory.
    app.register(autoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: { prefix: '/api' }, // Prefix for all routes loaded by this plugin.
    });

    // Return the configured Fastify instance.
    return app;
}

export default buildServer;
