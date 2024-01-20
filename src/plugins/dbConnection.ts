// plugins/dbConnection.ts
import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { IDatabaseConfig } from "../types/IDatabaseConfig.js";

/**
 * A registry mapping database types to their respective Fastify plugin modules.
 * This allows for easy extension and support for additional databases.
 */
const dbPluginRegistry: Record<string, string> = {
    'mongodb': '@fastify/mongodb', // MongoDB plugin path
    'postgres': '@fastify/postgres', // PostgreSQL plugin path
    'redis': '@fastify/redis' // Redis plugin path
    // Additional database plugins can be added here.
};

/**
 * A Fastify plugin for establishing database connections.
 * This plugin allows the application to support multiple databases and dynamically
 * loads the necessary database plugins based on the provided configuration.
 *
 * @param fastify - The Fastify instance.
 * @param options - An array of database configurations.
 */
const dbConnection: FastifyPluginAsync<IDatabaseConfig[]> = async (
    fastify: FastifyInstance,
    options: IDatabaseConfig[]
) => {
    for (const dbConfig of options) {
        const pluginPath = dbPluginRegistry[dbConfig.type];
        if (!pluginPath) {
            throw new Error(`Unsupported database type: ${dbConfig.type}`);
        }

        // Dynamically import the database plugin based on the type specified in dbConfig.
        const dbPlugin = await import(pluginPath);
        // Register the dynamically imported plugin with Fastify.
        await fastify.register(dbPlugin.default, dbConfig.config);
    }
};

export default fp(dbConnection, { name: 'dbConnection' });
