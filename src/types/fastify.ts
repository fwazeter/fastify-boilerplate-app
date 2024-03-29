//import { db, client } from '@fastify/mongodb';
import { IDatabaseClient } from './IDatabaseClient.js'; // Adjust the import path as needed

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            PORT: number;
            DB_URL: string;
            DB_NAME: string;
            // ... other configuration properties ...
        };
        db: IDatabaseClient; // Generic database client interface
    }
}

/*
mongo: {
    db: Db;
    client: MongoClient;
};*/
