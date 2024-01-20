export interface IDatabaseClient {
    /**
     * Method to find multiple documents in a specified collection in the database.
     * @param collection The name of the collection to query.
     * @param query The search criteria.
     * @param options Additional options for the query.
     * @returns A promise resolving to an array of documents.
     */
    find(collection: string, query: any, options?: any): Promise<any[]>;

    /**
     * Method to find a single document in a specified collection in the database.
     * @param collection The name of the collection to query.
     * @param query The search criteria.
     * @param options Additional options for the query.
     * @returns A promise resolving to a single document or null.
     */
    findOne(collection: string, query: any, options?: any): Promise<any | null>;

    /**
     * Method to insert a document into a specified collection in the database.
     * @param collection The name of the collection where the document will be inserted.
     * @param doc The document to insert.
     * @returns A promise resolving to the result of the insert operation.
     */
    insert(collection: string, doc: any): Promise<any>;

    /**
     * Method to update documents in a specified collection in the database.
     * @param collection The name of the collection containing the documents to update.
     * @param query The criteria to select documents to update.
     * @param update The update operations to apply.
     * @param options Additional options for the update operation.
     * @returns A promise resolving to the result of the update operation.
     */
    update(collection: string, query: any, update: any, options?: any): Promise<any>;

    /**
     * Method to delete documents from a specified collection in the database.
     * @param collection The name of the collection containing the documents to delete.
     * @param query The criteria to select documents to delete.
     * @param options Additional options for the delete operation.
     * @returns A promise resolving to the result of the delete operation.
     */
    delete(collection: string, query: any, options?: any): Promise<any>;

    /**
     * Method to perform an aggregation operation in a specified collection in the database.
     * @param collection The name of the collection on which to perform the aggregation.
     * @param pipeline An array defining the aggregation pipeline.
     * @returns A promise resolving to the result of the aggregation operation.
     */
    aggregate(collection: string, pipeline: any[]): Promise<any[]>;

    /**
     * Method to disconnect the database client.
     * @returns A promise resolving when the client has disconnected.
     */
    disconnect(): Promise<void>;
}
