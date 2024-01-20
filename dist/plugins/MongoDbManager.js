export class MongoDbManager {
    fastifyInstance;
    constructor(fastifyInstance) {
        this.fastifyInstance = fastifyInstance;
    }
    getCollection(collectionName) {
        return this.fastifyInstance.mongo.db.collection(collectionName);
    }
    async find(collection, query, options) {
        return this.getCollection(collection).find(query, options).toArray();
    }
    async findOne(collection, query, options) {
        return this.getCollection(collection).findOne(query, options);
    }
    async insert(collection, doc) {
        const result = await this.getCollection(collection).insertOne(doc);
        return { insertedId: result.insertedId, ...doc };
    }
    async update(collection, query, update, options) {
        return this.getCollection(collection).updateOne(query, update, options);
    }
    async delete(collection, query, options) {
        return this.getCollection(collection).deleteOne(query, options);
    }
    async aggregate(collection, pipeline) {
        return this.getCollection(collection).aggregate(pipeline).toArray();
    }
    async disconnect() {
    }
}
//# sourceMappingURL=MongoDbManager.js.map