import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { IDatabaseClient } from "../types/IDatabaseClient.js";

/**
 * Fastify plugin for database management.
 * It abstracts database operations and provides them as Fastify decorators.
 */
const dbManager: FastifyPluginAsync<{ dbClient: IDatabaseClient }> = async (
    fastify: FastifyInstance,
    options: { dbClient: IDatabaseClient }
) => {
    const { dbClient } = options;
    validateDbClient(dbClient);
    fastify.decorate('db', dbClient);

    fastify.addHook('onClose', async () => {
        if (dbClient && typeof dbClient.disconnect === 'function') {
            await dbClient.disconnect();
        }
    });
};

function validateDbClient(dbClient: IDatabaseClient): void {
    const requiredMethods = ['find', 'findOne', 'insert', 'update', 'delete', 'aggregate'];
    requiredMethods.forEach(method => {
        if (typeof (dbClient as any)[method] !== 'function') {
            throw new Error(`Database client does not implement required method: ${method}`);
        }
    });
}

export default fp(dbManager, { name: 'dbManager' });