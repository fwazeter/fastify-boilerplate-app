import { RouteBuilder } from './route-builder.js';
const routeFactory = (fastify, options, done) => {
    const routeBuilder = new RouteBuilder(fastify, options);
    routeBuilder.registerRoutes();
    done();
};
export default routeFactory;
//# sourceMappingURL=index.js.map