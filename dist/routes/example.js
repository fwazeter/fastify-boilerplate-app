import { ObjectId } from 'mongodb';
export default async function (app, opts) {
    console.log('Loading example routes');
    app.post('/example', async (request, reply) => {
        const item = request.body;
        const result = await app.db.insert('example', item);
        reply.code(201).send(result);
    });
    app.get('/example', async (request, reply) => {
        try {
            const items = await app.db.find('example', {});
            reply.send(items);
        }
        catch (error) {
            console.error(error);
            reply.send({ error: "An error occurred while fetching items" });
        }
    });
    app.get('/example/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        try {
            const item = await app.db.findOne('example', { _id: id });
            item ? reply.send(item) : reply.code(404).send({ message: 'Item not found' });
        }
        catch (error) {
            console.error(error);
            reply.send({ error: "An error occurred while fetching the item" });
        }
    });
    app.put('/example/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        const updateData = request.body;
        const result = await app.db.update('example', { _id: id }, { $set: updateData });
        reply.code(200).send({ message: 'Item updated', result });
    });
    app.delete('/example/:id', async (request, reply) => {
        const id = new ObjectId(request.params.id);
        const result = await app.db.delete('example', { _id: id });
        reply.code(200).send({ message: 'Item deleted', result });
    });
}
//# sourceMappingURL=example.js.map