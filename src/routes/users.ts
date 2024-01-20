import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ObjectId } from 'mongodb';

interface User {
    name: string;
    email: string;
    // other user fields...
}

export default async function (app: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
    console.log('Loading users routes');

    app.post<{ Body: User }>('/users', async (request, reply) => {
        const user = request.body;
        const result = await app.db.insert('users', user); // Pass 'users' and user object separately
        reply.code(201).send(result);
    });

    app.get<{ Querystring: any }>('/users', async (request, reply) => {
        try {
            const users = await app.db.find('users', {}); // Pass 'users' and query object separately
            reply.send(users);
        } catch (error) {
            console.error(error);
            reply.send({ error: "An error occurred while fetching users" });
        }
    });

    app.get<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        try {
            const user = await app.db.findOne('users', { _id: id }); // Pass 'users' and query object separately
            if (user) {
                reply.send(user);
            } else {
                reply.code(404).send({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            reply.send({ error: "An error occurred while fetching the user" });
        }
    });

    app.put<{ Params: { id: string }, Body: User }>('/users/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        const updateData = request.body;
        const result = await app.db.update('users', { _id: id }, { $set: updateData }); // Pass 'users', query object, and update object separately
        reply.code(200).send({ message: 'User updated', result });
    });

    app.delete<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        const result = await app.db.delete('users', { _id: id }); // Pass 'users' and query object separately
        reply.code(200).send({ message: 'User deleted', result });
    });
}
