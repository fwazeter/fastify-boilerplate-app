import { FastifyPluginCallback } from 'fastify';
import { RouteFactoryOptions } from './types.js';
import { RouteFactory } from './route-factory.js';

/**
 * A Fastify plugin function that initializes and uses the RouteFactory to register routes.
 * It takes a Fastify instance, options for route creation, and a done callback as parameters.
 *
 * @param fastify - The Fastify instance on which the plugin is registered.
 * @param options - The options to configure the RouteFactory, such as base path and collections.
 * @param done - Callback function to signal the completion of plugin registration.
 */
const routeFactory: FastifyPluginCallback<RouteFactoryOptions> = (fastify, options, done) => {
    const routeFactory = new RouteFactory(fastify, options);
    routeFactory.registerRoutes();
    done();
};

export default routeFactory;
