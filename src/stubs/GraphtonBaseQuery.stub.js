import { GraphtonEnum } from './GraphtonBaseEnum.stub';
import { GraphtonSettings } from "./Settings.stub";
/*ENDIGNORE*/
import axios from 'axios';
export class GraphtonBaseQuery {
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
        throw new Error(`Unsure how to argify ${argValue} (of type ${typeof argValue}).`);
    }
    /**
     * Execute the query
     */
    async execute(requestOptions = {}) {
        const response = await axios.post(requestOptions?.url || GraphtonSettings.graphqlEndpoint, { query: this.toQuery() }, {
            headers: {
                'Content-Type': 'application/json',
                ...GraphtonSettings.headers,
                ...requestOptions?.headers
            },
        });
        const returnData = {
            ...response.data,
            response
        };
        if (returnData.errors) {
            return Promise.reject(returnData);
        }
        return returnData;
    }
}
