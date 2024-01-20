import fp from 'fastify-plugin';
const dbPluginRegistry = {
    'mongodb': '@fastify/mongodb',
    'postgres': '@fastify/postgres',
    'redis': '@fastify/redis'
};
const dbConnection = async (fastify, options) => {
    for (const dbConfig of options) {
        const pluginPath = dbPluginRegistry[dbConfig.type];
        if (!pluginPath) {
            throw new Error(`Unsupported database type: ${dbConfig.type}`);
        }
        const dbPlugin = await import(pluginPath);
        await fastify.register(dbPlugin.default, dbConfig.config);
    }
};
export default fp(dbConnection, { name: 'dbConnection' });
//# sourceMappingURL=dbConnection.js.map