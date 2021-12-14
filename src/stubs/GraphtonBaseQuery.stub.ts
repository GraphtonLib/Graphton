/*IGNORE*/
import {GraphtonBaseReturnTypeBuilder} from './GraphtonBaseReturnTypeBuilder.stub';

const settings = {
    defaultHeaders: {},
    defaultUrl: ''
};
/*ENDIGNORE*/

import axios, {AxiosResponse} from 'axios';

type GraphQLServerEndpoint = string;
type Headers = Record<string, string>;

interface RequestOptions {
    headers?: Headers,
    url?: GraphQLServerEndpoint
}
interface QueryResponse {
    data: Record<string, unknown>,
    response: AxiosResponse
}

/*IGNORE*/export/*ENDIGNORE*/ class GraphtonEnum<T extends string> {
    public readonly enumValue: T;
    constructor(enumValue: T) {
        this.enumValue = enumValue;
    }
}

/*IGNORE*/export/*ENDIGNORE*/ type RootType = 'query'|'mutation'/*IGNORE*/|'/*ROOTTYPE*/'/*ENDIGNORE*/;

/*IGNORE*/export/*ENDIGNORE*/ abstract class GraphtonBaseQuery<T> {
    protected abstract queryName: string;
    protected abstract rootType: RootType;
    protected abstract returnType: GraphtonBaseReturnTypeBuilder<any, any> | null;

    public abstract setArgs(queryArgs: Partial<T>): void;
    protected abstract toArgString(): string;

    /**
     * Transform builder to graphql query string
     */
    public toQuery(): string {
        return `${this.rootType} ${this.queryName} { ${this.queryName}${this.toArgString()} ${this.returnType?.toReturnTypeString()||''} }`;
    }

    protected argify(argValue: unknown): string {
        if(argValue instanceof GraphtonEnum) {
            return `${argValue.enumValue}`;
        }
        if(Array.isArray(argValue)) {
            return `[${argValue.map(v=>this.argify(v))}]`;
        }
        if(typeof argValue === 'object' && !Array.isArray(argValue) && argValue !== null) {
            const decoded: string[] = [];
            for(const [key, value] of Object.entries(argValue)) {
                decoded.push(`${key}: ${this.argify(value)}`);
            }
            return `{${decoded.join(',')}}`;
        }
        if(typeof argValue === 'string' || typeof argValue === 'number' || typeof argValue === 'boolean' || argValue === null) {
            return JSON.stringify(argValue);
        }

        console.warn(`Unsure how to argify ${argValue} (of type ${typeof argValue}).`);
        return '';
    }

    /**
     * Execute the query
     */
    protected async execute(requestOptions: RequestOptions = {}): Promise<QueryResponse> {
        const response = await axios.post(requestOptions?.url || settings.defaultUrl, {query: this.toQuery()}, {
            headers: {
                'Content-Type': 'application/json',
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
