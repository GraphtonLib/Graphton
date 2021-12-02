type GraphQLServerEndpoint = string;
type Headers = Record<string, string>;

interface RequestOptions {
    headers?: Headers,
    url?: GraphQLServerEndpoint
}

abstract class GraphtonBaseQuery {
    protected availableFields: Set<string> = new Set([]);
    protected queryName = '';
    protected queryFields: Set<string> = new Set([]);

    /**
     * Add all known fields - this is defaultly set.
     */
    public allFields(): this {
        this.queryFields = new Set(this.availableFields);
        return this;
    }

    /**
     * Remove all fields.
     */
    public clearFields(): this {
        this.queryFields.clear();
        return this;
    }

    /**
     * Add multiple fields to the query.
     */
    public withFields(...fieldNames: (string|string[])[]): this {
        const flatFieldNames = fieldNames.flat();
        for(const fieldName of flatFieldNames) {
            if(!this.availableFields.has(fieldName)) {
                console.warn(`You are trying to query ${this.queryName} with a field named ${fieldName}, which might not exist!`);
            }

            this.queryFields.add(fieldName);
        }

        return this;
    }

    /**
     * Add a field to the query.
     */
    public withField(fieldName: string): this {
        return this.withFields(fieldName);
    }

    /**
     * Remove multiple fields from the query.
     */
    public withoutFields(...fieldNames: (string|string[])[]): this {
        const flatFieldNames = fieldNames.flat();
        for(const fieldName of flatFieldNames) {
            this.queryFields.delete(fieldName);
        }

        return this;
    }

    /**
     * Remove a field from the query.
     */
    public withoutField(fieldName: string): this {
        return this.withoutFields(fieldName);
    }

    /**
     * All of the fields, except these.
     */
    public except(...fieldNames: (string|string[])[]): this {
        return this.allFields().withoutFields(...fieldNames);
    }

    /**
     * Only the following fields, ignoring previously set fields.
     */
    public only(...fieldNames: (string|string[])[]): this {
        return this.clearFields().withFields(...fieldNames);
    }

    /**
     * Execute the query
     */
    public async get(requestOptions: RequestOptions = {}) {
        const query = `query ${this.queryName} { ${this.queryName} { ${[...this.queryFields].join(' ')} } }`;

        const options = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                ...settings.defaultHeaders,
                ...requestOptions?.headers
            },
            body: JSON.stringify({query})
        };

        return (await fetch(requestOptions?.url || settings.defaultUrl, options)).json();
    }
}
