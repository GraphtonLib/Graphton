const settings = {
    defaultHeaders: {},
    defaultUrl: ''
};
/*ENDIGNORE*/
import axios from 'axios';
/*IGNORE*/ export /*ENDIGNORE*/ class GraphtonBaseQuery {
    setArgs(queryArgs) {
        this.queryArgs = { ...this.queryArgs, ...queryArgs };
    }
    /**
     * Transform builder to graphql query string
     */
    toQuery() {
        const queryArgItems = [];
        for (const argKey in this.queryArgs) {
            if (this.queryArgs[argKey]) {
                queryArgItems.push(`${argKey}: ${JSON.stringify(this.queryArgs[argKey])}`);
            }
        }
        let queryArgString = '';
        if (queryArgItems.length > 0) {
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
