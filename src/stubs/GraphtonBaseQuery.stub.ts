/*IGNORE*/
import {GraphtonBaseReturnTypeBuilder} from "./GraphtonBaseReturnTypeBuilder.stub";

const settings = {
    defaultHeaders: {},
    defaultUrl: ''
};
/*ENDIGNORE*/

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

/*IGNORE*/export/*ENDIGNORE*/ type RootType = 'query'|'mutation'/*IGNORE*/|"/*ROOTTYPE*/"/*ENDIGNORE*/;

/*IGNORE*/export/*ENDIGNORE*/ abstract class GraphtonBaseQuery {
    protected abstract queryName: string;
    protected abstract arguments: Record<string, any>;
    protected abstract rootType: RootType;
    protected abstract returnType: GraphtonBaseReturnTypeBuilder | null;

    private toReturnTypeString(): string {
        if(this.returnType) {
            return `{ ${this.returnType.toReturnTypeString()} }`;
        }

        return '';
    }

    /**
     * Transform builder to graphql query string
     */
    public toQuery(): string {
        const queryArgs = Object.entries(this.arguments);
        let queryArgString: string = '';
        if (queryArgs.length > 0) {
            let queryArgItems: string[] = [];
            for (const [name, value] of queryArgs) {
                queryArgItems.push(`${name}: ${JSON.stringify(value)}`);
            }

            queryArgString = `(${queryArgItems.join(', ')})`;
        }

        return `${this.rootType} ${this.queryName} { ${this.queryName}${queryArgString} ${this.toReturnTypeString()} }`;
    }

    /**
     * Execute the query
     */
    protected async execute(requestOptions: RequestOptions = {}): Promise<QueryResponse> {
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
