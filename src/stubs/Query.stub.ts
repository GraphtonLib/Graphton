/*IGNORE*/
import {GraphtonBaseQuery, RootType} from "./GraphtonBaseQuery.stub.js";
import {__TYPENAME__ReturnTypeBuilder as __RETURNTYPEBUILDER__} from "./ReturnTypeBuilder.stub.js"

type GraphQLServerEndpoint = string;
type Headers = Record<string, string>;
import {AxiosResponse} from "axios";
interface RequestOptions {
    headers?: Headers,
    url?: GraphQLServerEndpoint
}
/*ENDIGNORE*/

interface __QUERYCLASSNAME__Response {
    data: {
        /*QUERYNAME*//*RETURNTYPE*/
    },
    response: AxiosResponse
}
class __QUERYCLASSNAME__ extends GraphtonBaseQuery {
    protected queryName = "/*QUERYNAME*/";
    protected arguments: Record<string, any> = {};
    protected rootType: RootType = "/*ROOTTYPE*/";
    protected returnType = new __RETURNTYPEBUILDER__();

    constructor(/*TYPEDPARAMS*/) {
        super();
        this.arguments = {/*PARAMS*/};
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }

    public returnFields(returnFieldsClosure: (r: __RETURNTYPEBUILDER__) => void) {
        returnFieldsClosure(this.returnType);
        return this;
    }

    async get(requestOptions: RequestOptions = {}): Promise<__QUERYCLASSNAME__Response> {
        return <__QUERYCLASSNAME__Response>(await super.execute());
    }
    async do(requestOptions: RequestOptions = {}): Promise<__QUERYCLASSNAME__Response> {
        return <__QUERYCLASSNAME__Response>(await super.execute());
    }
}
