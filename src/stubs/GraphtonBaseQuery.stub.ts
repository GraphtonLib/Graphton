import axios, {AxiosResponse} from "axios";

type GraphQLServerEndpoint = string;
type Headers = Record<string, string>;

interface RequestOptions {
    headers?: Headers,
    url?: GraphQLServerEndpoint
}
interface QueryResponse {
    data: Record<string, any>,
    response: AxiosResponse
}

abstract class GraphtonBaseQuery {
    protected availableFields: Set<string> = new Set([]);
    protected queryName: string = '';
    protected queryFields: Set<string> = new Set([]);
    protected arguments: Record<string, any> = {};
    protected rootType: 'query'|'mutation'|'' = '';

    /**
     * Add all known fields.
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
     * Transform builder to graphql query string
     */
    public toQuery() {
        const queryArgs = Object.entries(this.arguments);
        let queryArgString: string = '';
        if (queryArgs.length > 0) {
            let queryArgItems: string[] = [];
            for (const [name, value] of queryArgs) {
                queryArgItems.push(`${name}: ${JSON.stringify(value)}`);
            }

            queryArgString = `(${queryArgItems.join(', ')})`;
        }

        return `${this.rootType} ${this.queryName} { ${this.queryName}${queryArgString} { ${[...this.queryFields].join(' ')} } }`;
    }

    /**
     * Execute the query
     */
    protected async execute(requestOptions: RequestOptions = {}) {
        let response = await axios.post(requestOptions?.url || settings.defaultUrl, {query: this.toQuery()}, {
            headers: {
                "Content-Type": "application/json",
                ...settings.defaultHeaders,
                ...requestOptions?.headers
            },
        });

        return {
            data: response.data.data,
            response
        }
    }
}
