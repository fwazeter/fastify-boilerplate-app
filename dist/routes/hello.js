export default async function (fastify, opts) {
    console.log('Loading index routes');
    fastify.get('/', async (request, reply) => {
        return { message: 'Hello, this is working' };
    });
}
//# sourceMappingURL=hello.js.map