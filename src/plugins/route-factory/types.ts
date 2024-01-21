// types.ts

/**
 * RouteFactoryOptions defines the structure for options passed to the RouteBuilder plugin.
 * It includes a base path for the API routes and an array of collection configurations.
 */
export interface RouteFactoryOptions {
    basePath: string;
    collections: CollectionConfig[];
}

/**
 * CollectionConfig defines the structure of a collection configuration,
 * including the collection's name and an array of field configurations.
 */
export interface CollectionConfig {
    name: string;
    fields: FieldConfig[];
}

/**
 * FieldConfig defines the structure of a field within a collection,
 * including the field's key and its data type.
 */
export interface FieldConfig {
    key: string;
    type: string; // Can be extended for different data types handling
}

export interface RouteParams {
    id: string;
}
