import { RouteFactory } from './route-factory.js';
const routeFactory = (fastify, options, done) => {
    const routeFactory = new RouteFactory(fastify, options);
    routeFactory.registerRoutes();
    done();
};
export default routeFactory;
//# sourceMappingURL=index.js.map