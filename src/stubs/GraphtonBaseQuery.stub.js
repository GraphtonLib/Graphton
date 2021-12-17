import { GraphtonEnum } from './GraphtonBaseEnum.stub';
const settings = {
    defaultHeaders: {},
    defaultUrl: ''
};
/*ENDIGNORE*/
import axios from 'axios';
/*IGNORE*/ export /*ENDIGNORE*/ class GraphtonBaseQuery {
    /**
     * Transform builder to graphql query string
     */
    toQuery() {
        return `${this.rootType} ${this.queryName} { ${this.queryName}${this.toArgString()} ${this.returnType?.toReturnTypeString() || ''} }`;
    }
    argify(argValue) {
        if (argValue instanceof GraphtonEnum) {
            return `${argValue}`;
        }
        if (Array.isArray(argValue)) {
            return `[${argValue.map(v => this.argify(v))}]`;
        }
        if (typeof argValue === 'object' && !Array.isArray(argValue) && argValue !== null) {
            const decoded = [];
            for (const [key, value] of Object.entries(argValue)) {
                decoded.push(`${key}: ${this.argify(value)}`);
            }
            return `{${decoded.join(',')}}`;
        }
        if (typeof argValue === 'string' || typeof argValue === 'number' || typeof argValue === 'boolean' || argValue === null) {
            return JSON.stringify(argValue);
        }
        console.warn(`Unsure how to argify ${argValue} (of type ${typeof argValue}).`);
        return '';
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
