/**
 * Defines the possible types for a JSON schema property.
 * This enumeration covers all basic JSON data types.
 *
 * 'string': Represents text-based data.
 * 'number': Represents numerical values, both integer and floating-point.
 * 'boolean': Represents true or false values.
 * 'object': Represents a structured object with properties.
 * 'array': Represents an array of values.
 */
export type SchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array';

/**
 * Describes the base configuration options for a JSON schema property.
 * These options provide additional constraints or details about the property.
 *
 * minLength: (Optional) Specifies the minimum length for a string property.
 * maxLength: (Optional) Specifies the maximum length for a string property.
 * format: (Optional) Specifies a format that the string property should adhere to (e.g., 'email').
 * ...other base schema options can include additional JSON schema constraints.
 */
export interface BaseSchemaOptions {
    minLength?: number;
    maxLength?: number;
    format?: string;
    // ... other base schema options
}

/**
 * Represents the structure for defining properties and required fields within a nested object in a JSON schema.
 * This interface is used for properties of type 'object' to specify their inner structure.
 *
 * properties: (Optional) A record mapping property names to their schema definitions.
 * required: (Optional) An array of property names that are required within the nested object.
 */
export interface NestedProperties {
    properties?: Record<string, SchemaDefinition>;
    required?: string[];
}

/**
 * Combines the definitions for a schema property, including its type, base options, and nested properties.
 * This type is used for defining each property within a JSON schema object.
 *
 * type: (Optional) The type of the property, based on the SchemaType enumeration.
 * ...BaseSchemaOptions: Properties inherited from the BaseSchemaOptions interface for additional constraints.
 * ...Partial<NestedProperties>: (Optional) Nested properties and required fields for object-type properties.
 */
export type SchemaDefinition = {
    type?: SchemaType;
} & BaseSchemaOptions & Partial<NestedProperties>;
