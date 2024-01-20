import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ObjectId } from 'mongodb';

interface ExampleItem {
    name: string;
    email: string;
    // other fields specific to your example item...
}

/**
 * Example routes showcasing basic CRUD operations.
 */
export default async function (app: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
    console.log('Loading example routes');

    // Create a new example item
    app.post<{ Body: ExampleItem }>('/example', async (request, reply) => {
        const item = request.body;
        const result = await app.db.insert('example', item);
        reply.code(201).send(result);
    });

    // Retrieve all example items
    app.get('/example', async (request, reply) => {
        try {
            const items = await app.db.find('example', {});
            reply.send(items);
        } catch (error) {
            console.error(error);
            reply.send({ error: "An error occurred while fetching items" });
        }
    });

    // Retrieve a specific example item by ID
    app.get<{ Params: { id: string } }>('/example/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        try {
            const item = await app.db.findOne('example', { _id: id });
            item ? reply.send(item) : reply.code(404).send({ message: 'Item not found' });
        } catch (error) {
            console.error(error);
            reply.send({ error: "An error occurred while fetching the item" });
        }
    });

    // Update a specific example item by ID
    app.put<{ Params: { id: string }, Body: ExampleItem }>('/example/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        const updateData = request.body;
        const result = await app.db.update('example', { _id: id }, { $set: updateData });
        reply.code(200).send({ message: 'Item updated', result });
    });

    // Delete a specific example item by ID
    app.delete<{ Params: { id: string } }>('/example/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        const result = await app.db.delete('example', { _id: id });
        reply.code(200).send({ message: 'Item deleted', result });
    });
}
