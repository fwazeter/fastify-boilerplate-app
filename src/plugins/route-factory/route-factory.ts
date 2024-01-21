import { FastifyInstance, FastifyRequest, FastifyReply, FastifySchema } from 'fastify';
import { RouteFactoryOptions, CollectionConfig, FieldConfig, RouteParams } from './types.js';

/**
 * The RouteFactory class is responsible for dynamically creating and registering API routes
 * in a Fastify application based on provided configuration options. It automates the process
 * of setting up standard CRUD (Create, Read, Update, Delete) operations for different collections
 * defined in the application, thereby reducing manual routing setup and potential errors.
 *
 * Example Usage:
 *
 * // Assuming a Fastify instance and RouteFactoryOptions are defined
 * const RouteFactoryOptions: RouteFactoryOptions = {
 *         basePath: '/test',
 *         collections: [
 *             {
 *                 name: 'products', // Example collection
 *                 fields: [
 *                     { key: 'name', type: 'string' },
 *                     { key: 'price', type: 'number' }
 *                 ],
 *                 schema: {
 *                     post: { body: productSchema } // assuming taking Schema from another setup.
 *                 }
 *             }
 *             // Add more collections as needed
 *         ]
 *     };
 * const routeFactory = new RouteFactory(fastifyInstance, routeFactoryOptions);
 * routeFactory.registerRoutes();
 */
export class RouteFactory {
    /**
     * Constructor for the RouteFactory class.
     * Initializes a new instance with the provided Fastify instance and route configuration options.
     * The Fastify instance is used for route registration, while the options define the structure and behavior of the API routes.
     *
     * @param fastify The FastifyInstance to which the routes will be registered. It acts as the server instance for the application.
     * @param options Configuration options for route creation, including base path for the routes and the collections for which the routes are to be created.
     */
    constructor(private fastify: FastifyInstance, private options: RouteFactoryOptions) {}

    /**
     * Registers routes for each collection defined in the provided options.
     * This public method is used to initiate the route registration process, typically called after instantiating the RouteFactory class.
     * It iterates over the configured collections and calls a private method to register routes for each collection.
     */
    public registerRoutes() {
        this.options.collections.forEach((collection) => {
            this.registerCollectionRoutes(collection);
        });
    }

    /**
     * Registers CRUD API routes for a specific collection based on its configuration.
     * This private method sets up endpoints for creating, reading, updating, and deleting items in the collection.
     * It constructs the base path for the collection's routes and configures each route with the appropriate request handling method.
     *
     * @param collection The configuration object for the collection, including its name, fields, and optional schemas for different HTTP methods.
     */
    private registerCollectionRoutes(collection: CollectionConfig) {
        const basePath = `${this.options.basePath}/${collection.name}`;

        // Define schemas for different methods
        const postSchema: FastifySchema = collection.schema?.post?.valueOf() || {};
        const getSchema: FastifySchema = collection.schema?.get?.valueOf() || {};
        const putSchema: FastifySchema = collection.schema?.put?.valueOf() || {};
        const deleteSchema: FastifySchema = collection.schema?.delete?.valueOf() || {};

        // Register routes for the collection
        this.fastify.post(basePath, { schema: postSchema }, async (request, reply) => {
            return this.handleCollectionCreate(request, reply, collection.fields);
        });

        this.fastify.get(basePath, { schema: getSchema }, async (request, reply) => {
            return this.handleCollectionRead(request, reply, collection.fields);
        });

        this.fastify.get<{ Params: RouteParams }>(`${basePath}/:id`, { schema: getSchema }, async (request, reply) => {
            return this.handleCollectionReadOne(request, reply);
        });

        this.fastify.put<{ Params: RouteParams }>(`${basePath}/:id`, { schema: putSchema }, async (request, reply) => {
            return this.handleCollectionUpdate(request, reply);
        });

        this.fastify.delete<{ Params: RouteParams }>(`${basePath}/:id`, { schema: deleteSchema }, async (request, reply) => {
            return this.handleCollectionDelete(request, reply);
        });
    }

    /**
     * Handles the creation of a new item in a collection.
     * This method processes POST requests to the collection's base path.
     * It validates and inserts the new item into the database.
     *
     * @param request The Fastify request object.
     * @param reply The Fastify reply object.
     * @param fields The configuration fields for the collection, used for additional validation or processing.
     * @returns A promise that resolves with the creation result.
     */
    private async handleCollectionCreate(
        request: FastifyRequest,
        reply: FastifyReply,
        fields: FieldConfig[]
    ) {
        // Here, you can implement logic to validate and process the request based on fields.
        // For example, perform field-specific validation or transformation.

        try {
            const result = await this.fastify.db.insert(request.routeOptions.url.split('/')[2], request.body);
            return reply.code(201).send(result);
        } catch (error) {
            return reply.code(500).send({ error: "An error occurred while creating data" });
        }
    }

    /**
     * Handles reading all items from a collection.
     * This method processes GET requests to the collection's base path.
     * It fetches and returns all items from the specified collection.
     *
     * @param request The Fastify request object.
     * @param reply The Fastify reply object.
     * @param fields The configuration fields for the collection, used for additional processing.
     * @returns A promise that resolves with the fetched items.
     */
    private async handleCollectionRead(
        request: FastifyRequest,
        reply: FastifyReply,
        fields: FieldConfig[]
    ) {
        // Implement any field-specific logic for reading data, if necessary.

        try {
            const items = await this.fastify.db.find(request.routeOptions.url.split('/')[2], {});
            return reply.send(items);
        } catch (error) {
            return reply.code(500).send({ error: "An error occurred while fetching data" });
        }
    }

    /**
     * Handles reading a single item from a collection based on its ID.
     * This method processes GET requests to the collection's base path with an item ID.
     * It fetches and returns a specific item from the collection.
     *
     * @param request The Fastify request object, including route parameters.
     * @param reply The Fastify reply object.
     * @returns A promise that resolves with the fetched item or a 404 error if not found.
     */
    private async handleCollectionReadOne(
        request: FastifyRequest<{Params: RouteParams}>,
        reply: FastifyReply
    ) {
        try {
            const id = this.fastify.db.getID(request.params.id);
            const item = await this.fastify.db.findOne(request.routeOptions.url.split('/')[2], { _id: id });
            if (item) {
                return reply.send(item);
            } else {
                return reply.code(404).send({ message: 'Item not found' });
            }
        } catch (error) {
            return reply.code(500).send({ error: "An error occurred while fetching the item" });
        }
    }

    /**
     * Handles updating an existing item in a collection.
     * This method processes PUT requests to the collection's base path with an item ID.
     * It updates the specified item based on the request body.
     *
     * @param request The Fastify request object, including route parameters.
     * @param reply The Fastify reply object.
     * @returns A promise that resolves with the update result.
     */
    private async handleCollectionUpdate(
        request: FastifyRequest<{Params: RouteParams}>,
        reply: FastifyReply
    ) {
        try {
            const id = this.fastify.db.getID(request.params.id);
            const result = await this.fastify.db.update(request.routeOptions.url.split('/')[2], { _id: id }, { $set: request.body });
            return reply.code(200).send({ message: 'Item updated', result });
        } catch (error) {
            return reply.code(500).send({ error: "An error occurred while updating the item" });
        }
    }

    /**
     * Handles deleting an existing item from a collection.
     * This method processes DELETE requests to the collection's base path with an item ID.
     * It removes the specified item from the collection.
     *
     * @param request The Fastify request object, including route parameters.
     * @param reply The Fastify reply object.
     * @returns A promise that resolves with the deletion result.
     */
    private async handleCollectionDelete(
        request: FastifyRequest<{Params: RouteParams}>,
        reply: FastifyReply
    ) {
        try {
            const id = this.fastify.db.getID(request.params.id);
            const result = await this.fastify.db.delete(request.routeOptions.url.split('/')[2], { _id: id });
            return reply.code(200).send({ message: 'Item deleted', result });
        } catch (error) {
            return reply.code(500).send({ error: "An error occurred while deleting the item" });
        }
    }
}
