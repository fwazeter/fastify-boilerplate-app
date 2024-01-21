import {ObjectSchema, S} from 'fluent-json-schema';

export class SchemaBuilder {
    /**
     * Adds properties to a schema with common configurations and handles nested objects.
     * @param properties - An object mapping property names to their types or nested schemas.
     * @param requiredFields - An array of strings representing the names of required fields.
     * @returns A Fluent JSON Schema for the object.
     */
    static add(properties: Record<string, any>, requiredFields: string[] = []) {
        return SchemaBuilder.buildObjectSchema(properties, new Set(requiredFields));
    }

    private static buildObjectSchema(properties: Record<string, any>, requiredFields: Set<string>, path: string = ''): ObjectSchema {
        let schema = S.object();
        let currentLevelRequiredFields = new Set<string>();

        for (const [key, value] of Object.entries(properties)) {
            const currentPath = path ? `${path}.${key}` : key;
            let fieldSchema;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Nested object
                fieldSchema = SchemaBuilder.buildObjectSchema(value, requiredFields, currentPath);
            } else {
                // Primitive type
                fieldSchema = SchemaBuilder.getType(value);
            }

            if (requiredFields.has(currentPath) || (typeof value === 'object' && value !== null && SchemaBuilder.hasNestedRequiredFields(value, requiredFields, currentPath))) {
                currentLevelRequiredFields.add(key);
            }

            schema = schema.prop(key, fieldSchema);
        }

        if (currentLevelRequiredFields.size > 0) {
            schema = schema.required(Array.from(currentLevelRequiredFields));
        }

        return schema;
    }

    private static hasNestedRequiredFields(properties: Record<string, any>, requiredFields: Set<string>, path: string): boolean {
        for (const [key, _] of Object.entries(properties)) {
            const currentPath = `${path}.${key}`;
            if (requiredFields.has(currentPath)) {
                return true;
            }
        }
        return false;
    }
    
    private static getType(type: string) {
        switch (type) {
            case 'string':
                return S.string();
            case 'number':
                return S.number();
            case 'integer':
                return S.integer();
            case 'boolean':
                return S.boolean();
            case 'null':
                return S.null();
            case 'array':
                return S.array().items(S.string());
            case 'object':
                return S.object();
            case 'date':
                return S.string().format('date');
            case 'time':
                return S.string().format('time');
            case 'dateTime':
                return S.string().format('date-time');
            case 'email':
                return S.string().format('email');
            case 'hostname':
                return S.string().format('hostname');
            case 'ipv4':
                return S.string().format('ipv4');
            case 'ipv6':
                return S.string().format('ipv6');
            case 'uri':
                return S.string().format('uri');
            case 'binary':
                return S.string().contentEncoding('binary');
            case 'byte':
                return S.string().contentEncoding('base64');
            // Add more specific cases as needed
            default:
                throw new Error(`Unsupported type for schema property: ${type}`);
        }
    }

}
