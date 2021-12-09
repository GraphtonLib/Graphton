const settings = {
    defaultHeaders: {},
    defaultUrl: ''
};
/*ENDIGNORE*/
import axios from 'axios';
/*IGNORE*/ export /*ENDIGNORE*/ class GraphtonBaseQuery {
    queryArgs = {};
    setArgs(queryArgs) {
        const newArgs = {};
        const mergedArgs = { ...this.queryArgs, ...queryArgs };
        for (const key in mergedArgs) {
            if (this.queryArgs[key] !== undefined && this.queryArgs[key] !== null) {
                newArgs[key] = this.queryArgs[key];
            }
        }
    }
    /**
     * Transform builder to graphql query string
     */
    toQuery() {
        const queryArgs = Object.entries(this.queryArgs);
        let queryArgString = '';
        if (queryArgs.length > 0) {
            const queryArgItems = [];
            for (const [name, value] of queryArgs) {
                queryArgItems.push(`${name}: ${JSON.stringify(value)}`);
            }
            queryArgString = `(${queryArgItems.join(', ')})`;
        }
        return `${this.rootType} ${this.queryName} { ${this.queryName}${queryArgString} ${this.returnType?.toReturnTypeString() || ''} }`;
    }
    /**
     * Execute the query
     */
    async execute(requestOptions = {}) {
        const response = await axios.post(requestOptions?.url || settings.defaultUrl, { query: this.toQuery() }, {
            headers: {
                'Content-Type': 'application/json',
                ...settings.defaultHeaders,
                ...requestOptions?.headers
            },
        });
        return {
            data: response.data.data,
            response
        };
    }
}
