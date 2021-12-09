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
type QueryArgs<T> = {
    [Property in keyof T]: string|boolean|number|null|undefined;
}

/*IGNORE*/export/*ENDIGNORE*/ type RootType = 'query'|'mutation'/*IGNORE*/|'/*ROOTTYPE*/'/*ENDIGNORE*/;

/*IGNORE*/export/*ENDIGNORE*/ abstract class GraphtonBaseQuery<QueryArgumentType extends QueryArgs<QueryArgumentType>> {
    protected abstract queryName: string;
    protected queryArgs: Partial<NonNullable<QueryArgumentType>> = {};
    protected abstract rootType: RootType;
    protected abstract returnType: GraphtonBaseReturnTypeBuilder<any, any> | null;

    public setArgs(queryArgs: Partial<QueryArgumentType>): void {
        const newArgs: Partial<NonNullable<QueryArgumentType>> = {};
        const mergedArgs: Partial<QueryArgumentType> = {...this.queryArgs, ...queryArgs};
        for(const key in mergedArgs) {
            if (this.queryArgs[key] !== undefined && this.queryArgs[key] !== null) {
                newArgs[key] = this.queryArgs[key];
            }
        }
    }

    /**
     * Transform builder to graphql query string
     */
    public toQuery(): string {
        const queryArgs = Object.entries(this.queryArgs);
        let queryArgString = '';
        if (queryArgs.length > 0) {
            const queryArgItems: string[] = [];
            for (const [name, value] of queryArgs) {
                queryArgItems.push(`${name}: ${JSON.stringify(value)}`);
            }

            queryArgString = `(${queryArgItems.join(', ')})`;
        }

        return `${this.rootType} ${this.queryName} { ${this.queryName}${queryArgString} ${this.returnType?.toReturnTypeString()||''} }`;
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
