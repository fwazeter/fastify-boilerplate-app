import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
    console.log('Loading index routes');
    fastify.get('/', async (request, reply) => {
        return { message: 'Hello, this is working' };
    });
}
