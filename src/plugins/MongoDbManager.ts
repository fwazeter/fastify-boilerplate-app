// MongoDbManager.ts
import { FastifyInstance } from 'fastify';
import { IDatabaseClient } from "../types/IDatabaseClient.js";
import { Collection } from 'mongodb';

/**
 * MongoDbManager class implements IDatabaseClient interface to manage MongoDB operations.
 * It provides methods for common database operations.
 */
export class MongoDbManager implements IDatabaseClient {
    private fastifyInstance: FastifyInstance;

    /**
     * Constructor to create an instance of MongoDbManager.
     * @param fastifyInstance The Fastify instance to access database client.
     */
    constructor(fastifyInstance: FastifyInstance) {
        this.fastifyInstance = fastifyInstance;
    }

    /**
     * Retrieves a MongoDB collection by name.
     * @param collectionName The name of the collection to retrieve.
     * @returns The MongoDB Collection object.
     */
    private getCollection(collectionName: string): Collection {
        return this.fastifyInstance.mongo.db.collection(collectionName);
    }

    /**
     * Finds documents in a collection that match the given query.
     * @param collection The name of the collection to query.
     * @param query Query object to find matching documents.
     * @param options Additional options for the query.
     * @returns A promise resolving to an array of found documents.
     */
    async find(collection: string, query: any, options?: any): Promise<any[]> {
        return this.getCollection(collection).find(query, options).toArray();
    }

    /**
     * Finds a single document in a collection that matches the given query.
     * @param collection The name of the collection to query.
     * @param query Query object to find a matching document.
     * @param options Additional options for the query.
     * @returns A promise resolving to the found document or null.
     */
    async findOne(collection: string, query: any, options?: any): Promise<any | null> {
        return this.getCollection(collection).findOne(query, options);
    }

    /**
     * Inserts a document into a collection.
     * @param collection The name of the collection where the document will be inserted.
     * @param doc The document to insert.
     * @returns A promise resolving to the result of the insert operation.
     */
    async insert(collection: string, doc: any): Promise<any> {
        const result = await this.getCollection(collection).insertOne(doc);
        return { insertedId: result.insertedId, ...doc };
    }

    /**
     * Updates documents in a collection that match the given query.
     * @param collection The name of the collection to update.
     * @param query Query object to select documents to update.
     * @param update Update operations to apply to the documents.
     * @param options Additional options for the update operation.
     * @returns A promise resolving to the result of the update operation.
     */
    async update(collection: string, query: any, update: any, options?: any): Promise<any> {
        return this.getCollection(collection).updateOne(query, update, options);
    }

    /**
     * Deletes documents from a collection that match the given query.
     * @param collection The name of the collection to delete from.
     * @param query Query object to select documents to delete.
     * @param options Additional options for the delete operation.
     * @returns A promise resolving to the result of the delete operation.
     */
    async delete(collection: string, query: any, options?: any): Promise<any> {
        return this.getCollection(collection).deleteOne(query, options);
    }

    /**
     * Performs an aggregation operation on a collection.
     * @param collection The name of the collection to perform aggregation.
     * @param pipeline An array defining the aggregation pipeline.
     * @returns A promise resolving to the result of the aggregation operation.
     */
    async aggregate(collection: string, pipeline: any[]): Promise<any[]> {
        return this.getCollection(collection).aggregate(pipeline).toArray();
    }

    /**
     * Disconnects from the database.
     * Note: Connection management is usually handled by @fastify/mongodb.
     */
    async disconnect(): Promise<void> {
        // Connection management is handled by @fastify/mongodb
    }
}
