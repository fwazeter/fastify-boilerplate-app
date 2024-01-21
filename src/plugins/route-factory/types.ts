import {FastifySchema} from "fastify";

/**
 * Defines the configuration options for the RouteFactory plugin, including a base path
 * for API routes and an array of configurations for each collection.
 */
export interface RouteFactoryOptions {
    basePath: string;
    collections: CollectionConfig[];
}

/**
 * Describes the configuration for a collection within the API. It includes the collection's name
 * and an array of field configurations that describe the structure of the collection's data.
 */
export interface CollectionConfig {
    name: string;
    fields: FieldConfig[];
    schema?: {
        get?: FastifySchema;
        post?: FastifySchema;
        put?: FastifySchema;
        delete?: FastifySchema;
    };
}

/**
 * Describes the configuration for an individual field within a collection. It includes
 * the field's key (name) and its data type. The type can be extended to support various data types.
 */
export interface FieldConfig {
    key: string;
    type: string;
}

/**
 * Defines the structure for route parameters, particularly for routes that require an ID.
 * This is mainly used for routes handling individual collection items.
 */
export interface RouteParams {
    id: string;
}
