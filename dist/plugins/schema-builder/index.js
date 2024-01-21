import { S } from 'fluent-json-schema';
export class SchemaBuilder {
    static add(properties, requiredFields = []) {
        return SchemaBuilder.buildObjectSchema(properties, new Set(requiredFields));
    }
    static buildObjectSchema(properties, requiredFields, path = '') {
        let schema = S.object();
        let currentLevelRequiredFields = new Set();
        for (const [key, value] of Object.entries(properties)) {
            const currentPath = path ? `${path}.${key}` : key;
            let fieldSchema;
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                fieldSchema = SchemaBuilder.buildObjectSchema(value, requiredFields, currentPath);
            }
            else {
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
    static hasNestedRequiredFields(properties, requiredFields, path) {
        for (const [key, _] of Object.entries(properties)) {
            const currentPath = `${path}.${key}`;
            if (requiredFields.has(currentPath)) {
                return true;
            }
        }
        return false;
    }
    static getType(type) {
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
            default:
                throw new Error(`Unsupported type for schema property: ${type}`);
        }
    }
}
//# sourceMappingURL=index.js.map