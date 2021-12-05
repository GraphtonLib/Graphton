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
    protected returnType = /*IF:RETURNTYPEOBJECT*/new/*ENDIF:RETURNTYPEOBJECT*/ __RETURNTYPEBUILDER__/*IF:RETURNTYPEOBJECT*/()/*ENDIF:RETURNTYPEOBJECT*/;

    constructor(/*TYPEDPARAMS*/) {
        super();
        this.arguments = {/*PARAMS*/};
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }

    /*IF:RETURNTYPEOBJECT*/
    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    public returnFields(returnFieldsClosure: (r: __RETURNTYPEBUILDER__) => void) {
        returnFieldsClosure(this.returnType);
        return this;
    }
    /*ENDIF:RETURNTYPEOBJECT*/

    /*IF:ADDGET*/
    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    async get(requestOptions: RequestOptions = {}): Promise<__QUERYCLASSNAME__Response> {
        return <__QUERYCLASSNAME__Response>(await super.execute(requestOptions));
    }
    /*ENDIF:ADDGET*/
    /*IF:ADDDO*/
    /**
     * Do the mutation on the server
     * Only available on Mutation type requests
     */
    async do(requestOptions: RequestOptions = {}): Promise<__QUERYCLASSNAME__Response> {
        return <__QUERYCLASSNAME__Response>(await super.execute(requestOptions));
    }
    /*ENDIF:ADDDO*/
}
