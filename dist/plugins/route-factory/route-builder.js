export class RouteBuilder {
    fastify;
    options;
    constructor(fastify, options) {
        this.fastify = fastify;
        this.options = options;
    }
    registerRoutes() {
        this.options.collections.forEach((collection) => {
            this.registerCollectionRoutes(collection);
        });
    }
    registerCollectionRoutes(collection) {
        const basePath = `${this.options.basePath}/${collection.name}`;
        this.fastify.post(basePath, async (request, reply) => {
            return this.handleCollectionCreate(request, reply, collection.fields);
        });
        this.fastify.get(basePath, async (request, reply) => {
            return this.handleCollectionRead(request, reply, collection.fields);
        });
        this.fastify.get(`${basePath}/:id`, async (request, reply) => {
            return this.handleCollectionReadOne(request, reply);
        });
        this.fastify.put(`${basePath}/:id`, async (request, reply) => {
            return this.handleCollectionUpdate(request, reply);
        });
        this.fastify.delete(`${basePath}/:id`, async (request, reply) => {
            return this.handleCollectionDelete(request, reply);
        });
    }
    async handleCollectionCreate(request, reply, fields) {
        try {
            const result = await this.fastify.db.insert(request.routerPath.split('/')[2], request.body);
            return reply.code(201).send(result);
        }
        catch (error) {
            return reply.code(500).send({ error: "An error occurred while creating data" });
        }
    }
    async handleCollectionRead(request, reply, fields) {
        try {
            const items = await this.fastify.db.find(request.routerPath.split('/')[2], {});
            return reply.send(items);
        }
        catch (error) {
            return reply.code(500).send({ error: "An error occurred while fetching data" });
        }
    }
    async handleCollectionReadOne(request, reply) {
        try {
            const id = this.fastify.db.getID(request.params.id);
            const item = await this.fastify.db.findOne(request.routerPath.split('/')[2], { _id: id });
            if (item) {
                return reply.send(item);
            }
            else {
                return reply.code(404).send({ message: 'Item not found' });
            }
        }
        catch (error) {
            return reply.code(500).send({ error: "An error occurred while fetching the item" });
        }
    }
    async handleCollectionUpdate(request, reply) {
        try {
            const id = this.fastify.db.getID(request.params.id);
            const result = await this.fastify.db.update(request.routerPath.split('/')[2], { _id: id }, { $set: request.body });
            return reply.code(200).send({ message: 'Item updated', result });
        }
        catch (error) {
            return reply.code(500).send({ error: "An error occurred while updating the item" });
        }
    }
    async handleCollectionDelete(request, reply) {
        try {
            const id = this.fastify.db.getID(request.params.id);
            const result = await this.fastify.db.delete(request.routerPath.split('/')[2], { _id: id });
            return reply.code(200).send({ message: 'Item deleted', result });
        }
        catch (error) {
            return reply.code(500).send({ error: "An error occurred while deleting the item" });
        }
    }
}
//# sourceMappingURL=route-builder.js.map