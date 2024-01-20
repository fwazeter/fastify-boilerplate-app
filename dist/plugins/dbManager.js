import fp from 'fastify-plugin';
const dbManager = async (fastify, options) => {
    const { dbClient } = options;
    validateDbClient(dbClient);
    fastify.decorate('db', dbClient);
    fastify.addHook('onClose', async () => {
        if (dbClient && typeof dbClient.disconnect === 'function') {
            await dbClient.disconnect();
        }
    });
};
function validateDbClient(dbClient) {
    const requiredMethods = ['find', 'findOne', 'insert', 'update', 'delete', 'aggregate'];
    requiredMethods.forEach(method => {
        if (typeof dbClient[method] !== 'function') {
            throw new Error(`Database client does not implement required method: ${method}`);
        }
    });
}
export default fp(dbManager, { name: 'dbManager' });
//# sourceMappingURL=dbManager.js.map