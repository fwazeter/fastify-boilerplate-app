// index.ts

import { FastifyPluginCallback } from 'fastify';
import { RouteFactoryOptions } from './types.js';
import { RouteBuilder } from './route-builder.js';

/**
 * The plugin function for Fastify that initializes and uses the RouteBuilder to register routes.
 */
const routeFactory: FastifyPluginCallback<RouteFactoryOptions> = (fastify, options, done) => {
    const routeBuilder = new RouteBuilder(fastify, options);
    routeBuilder.registerRoutes();
    done();
};

export default routeFactory;
