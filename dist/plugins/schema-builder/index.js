class SchemaBuilder {
    schema;
    constructor() {
        this.schema = {
            type: 'object',
            properties: {},
            required: []
        };
    }
    addProperty(name, type, options = { type }) {
        const { properties, required, ...otherOptions } = options;
        if (type === 'object') {
            this.schema.properties[name] = {
                type: 'object',
                properties: properties || {},
                required: required || [],
                ...otherOptions
            };
            if (required && required.length > 0) {
                this.setRequired([name]);
            }
        }
        else {
            this.schema.properties[name] = { type, ...otherOptions };
        }
        return this;
    }
    setRequired(fields) {
        this.schema.required = Array.from(new Set([...this.schema.required, ...fields]));
        return this;
    }
    build() {
        return this.schema;
    }
}
export default SchemaBuilder;
//# sourceMappingURL=index.js.map