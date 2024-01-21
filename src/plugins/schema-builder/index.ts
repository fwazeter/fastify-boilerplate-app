import { SchemaType, SchemaDefinition } from "./types.js"

/**
 * A utility class for building JSON Schemas, particularly for use with Fastify.
 * This class provides a fluent API to construct a JSON schema object dynamically.
 *
 * Example Usage:
 *
 * Creating a product schema with various properties including a nested 'details' object.
 *
 * const productSchema = new SchemaBuilder()
 *     .addProperty('name', 'string', { minLength: 2, maxLength: 10 })
 *     .addProperty('price', 'number')
 *     .addProperty('email', 'string', { format: 'email' })
 *     .addProperty('inStock', 'boolean')
 *     .addProperty('tags', 'array')
 *     .addProperty('details', 'object', {
 *         properties: {
 *             manufacturer: { type: 'string' },
 *             warranty: { type: 'string' }
 *         },
 *         required: ['manufacturer']
 *     })
 *     .setRequired(['name', 'price', 'email'])
 *     .build();
 *
 * // The resulting productSchema is a JSON schema object that can be used with Fastify.
 */
class SchemaBuilder {
    private readonly schema: {
        type: 'object';
        properties: Record<string, SchemaDefinition>;
        required: string[];
    };

    /**
     * Constructs a new SchemaBuilder instance.
     * Initializes the schema as an empty object with no properties and no required fields.
     */
    constructor() {
        this.schema = {
            type: 'object',
            properties: {},
            required: []
        };
    }

    /**
     * Adds a property to the schema.
     * @param name The name of the property.
     * @param type The JSON schema data type of the property.
     * @param options Additional options for the property, including nested properties and required fields for objects.
     * @returns The SchemaBuilder instance for method chaining.
     */
    addProperty(name: string, type: SchemaType, options: SchemaDefinition = { type }): SchemaBuilder {
        const { properties, required, ...otherOptions } = options;

        if (type === 'object') {
            // Handle object properties, including nested properties and required fields
            this.schema.properties[name] = {
                type: 'object',
                properties: properties || {},
                required: required || [],
                ...otherOptions
            };
            if (required && required.length > 0) {
                // If there are required fields in a nested object, mark the object itself as required
                this.setRequired([name]);
            }
        } else {
            // Handle non-object properties
            this.schema.properties[name] = { type, ...otherOptions };
        }
        return this;
    }

    /**
     * Marks certain fields as required at the root level of the schema.
     * @param fields An array of field names to be marked as required.
     * @returns The SchemaBuilder instance for method chaining.
     */
    setRequired(fields: string[]): SchemaBuilder {
        // Ensures no duplicates in the required array
        this.schema.required = Array.from(new Set([...this.schema.required, ...fields]));
        return this;
    }

    /**
     * Builds and returns the JSON schema object.
     * @returns The constructed JSON schema object.
     */
    build(): { type: 'object'; properties: Record<string, SchemaDefinition>; required: string[] } {
        return this.schema;
    }
}

export default SchemaBuilder;