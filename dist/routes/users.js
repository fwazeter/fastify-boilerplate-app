import { ObjectId } from 'mongodb';
export default async function (app, opts) {
    console.log('Loading users routes');
    app.post('/users', async (request, reply) => {
        const user = request.body;
        const result = await app.db.insert('users', user);
        reply.code(201).send(result);
    });
    app.get('/users', async (request, reply) => {
        try {
            const users = await app.db.find('users', {});
            reply.send(users);
        }
        catch (error) {
            console.error(error);
            reply.send({ error: "An error occurred while fetching users" });
        }
    });
    app.get('/users/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        try {
            const user = await app.db.findOne('users', { _id: id });
            if (user) {
                reply.send(user);
            }
            else {
                reply.code(404).send({ message: 'User not found' });
            }
        }
        catch (error) {
            console.error(error);
            reply.send({ error: "An error occurred while fetching the user" });
        }
    });
    app.put('/users/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        const updateData = request.body;
        const result = await app.db.update('users', { _id: id }, { $set: updateData });
        reply.code(200).send({ message: 'User updated', result });
    });
    app.delete('/users/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        const result = await app.db.delete('users', { _id: id });
        reply.code(200).send({ message: 'User deleted', result });
    });
}
//# sourceMappingURL=users.js.map