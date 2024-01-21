import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RouteFactoryOptions, CollectionConfig, FieldConfig, RouteParams } from './types.js';

/**
 * The RouteFactory class is responsible for dynamically creating and registering API routes
 * based on provided configuration options in a Fastify application.
 */
export class RouteFactory {
    /**
     * Initializes a new instance of the RouteFactory class.
     * @param fastify - The FastifyInstance to which the routes will be registered.
     * @param options - Configuration options for route creation.
     */
    constructor(private fastify: FastifyInstance, private options: RouteFactoryOptions) {}

    /**
     * Iterates over each collection defined in the options and registers corresponding API routes.
     */
    public registerRoutes() {
        this.options.collections.forEach((collection) => {
            this.registerCollectionRoutes(collection);
        });
    }

    /**
     * Registers API routes for a specific collection. This includes the CRUD operations.
     * @param collection - The collection configuration for which to register routes.
     */
    private registerCollectionRoutes(collection: CollectionConfig) {
        const basePath = `${this.options.basePath}/${collection.name}`;
        this.fastify.post(basePath, async (request, reply) => {
            return this.handleCollectionCreate(request, reply, collection.fields);
        });

        this.fastify.get(basePath, async (request, reply) => {
            return this.handleCollectionRead(request, reply, collection.fields);
        });

        this.fastify.get<{ Params: RouteParams }>(`${basePath}/:id`, async (request, reply) => {
            return this.handleCollectionReadOne(request, reply);
        });

        this.fastify.put<{ Params: RouteParams }>(`${basePath}/:id`, async (request, reply) => {
            return this.handleCollectionUpdate(request, reply);
        });

        this.fastify.delete<{ Params: RouteParams }>(`${basePath}/:id`, async (request, reply) => {
            return this.handleCollectionDelete(request, reply);
        });
    }

    private async handleCollectionCreate(
        request: FastifyRequest,
        reply: FastifyReply,
        fields: FieldConfig[]
    ) {
        // Here, you can implement logic to validate and process the request based on fields.
        // For example, perform field-specific validation or transformation.

        try {
            const result = await this.fastify.db.insert(request.routerPath.split('/')[2], request.body);
            return reply.code(201).send(result);
        } catch (error) {
            return reply.code(500).send({ error: "An error occurred while creating data" });
        }
    }

    private async handleCollectionRead(
        request: FastifyRequest,
        reply: FastifyReply,
        fields: FieldConfig[]
    ) {
        // Implement any field-specific logic for reading data, if necessary.

        try {
            const items = await this.fastify.db.find(request.routerPath.split('/')[2], {});
            return reply.send(items);
        } catch (error) {
            return reply.code(500).send({ error: "An error occurred while fetching data" });
        }
    }

    private async handleCollectionReadOne(
        request: FastifyRequest<{Params: RouteParams}>,
        reply: FastifyReply
    ) {
        try {
            const id = this.fastify.db.getID(request.params.id);
            const item = await this.fastify.db.findOne(request.routerPath.split('/')[2], { _id: id });
            if (item) {
                return reply.send(item);
            } else {
                return reply.code(404).send({ message: 'Item not found' });
            }
        } catch (error) {
            return reply.code(500).send({ error: "An error occurred while fetching the item" });
        }
    }

    private async handleCollectionUpdate(
        request: FastifyRequest<{Params: RouteParams}>,
        reply: FastifyReply
    ) {
        try {
            const id = this.fastify.db.getID(request.params.id);
            const result = await this.fastify.db.update(request.routerPath.split('/')[2], { _id: id }, { $set: request.body });
            return reply.code(200).send({ message: 'Item updated', result });
        } catch (error) {
            return reply.code(500).send({ error: "An error occurred while updating the item" });
        }
    }

    private async handleCollectionDelete(
        request: FastifyRequest<{Params: RouteParams}>,
        reply: FastifyReply
    ) {
        try {
            const id = this.fastify.db.getID(request.params.id);
            const result = await this.fastify.db.delete(request.routerPath.split('/')[2], { _id: id });
            return reply.code(200).send({ message: 'Item deleted', result });
        } catch (error) {
            return reply.code(500).send({ error: "An error occurred while deleting the item" });
        }
    }
}
