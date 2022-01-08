/*IGNORE*/
import {GraphtonBaseQuery, RootType} from './GraphtonBaseQuery.stub.js';
import {_t_TYPENAME_t_ReturnTypeBuilder as _t_RETURNTYPEBUILDER_t_} from './ReturnTypeBuilder.stub.js'

type GraphQLServerEndpoint = string;
type Headers = Record<string, string>;
import {AxiosResponse} from 'axios';
interface RequestOptions {
    headers?: Headers,
    url?: GraphQLServerEndpoint
}
/*ENDIGNORE*/

/*IF:ADDEXECUTOR*/
export interface _t_QUERYCLASSNAME_t_Response {
    data: {
        /*QUERYNAME*//*RETURNTYPE*/
    };
    response: AxiosResponse;
}
/*ENDIF:ADDEXECUTOR*/

/*IF:ARGUMENTS*/
export interface _t_ARGUMENTINTERFACENAME_t_ {
    /*ARGUMENTINTERFACEPROPERTIES*//*IGNORE*/[key: string]: string|boolean|number/*ENDIGNORE*/;
}
/*ENDIF:ARGUMENTS*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class _t_QUERYCLASSNAME_t_ extends GraphtonBaseQuery<_t_ARGUMENTINTERFACENAME_t_> {
    protected queryName = '/*QUERYNAME*/';
    protected queryArgs: Partial<_t_ARGUMENTINTERFACENAME_t_> = {};
    protected rootType: RootType = '/*ROOTTYPE*/';
    protected returnType = /*IF:RETURNTYPEOBJECT*/new/*ENDIF:RETURNTYPEOBJECT*/ _t_RETURNTYPEBUILDER_t_/*IF:RETURNTYPEOBJECT*/()/*ENDIF:RETURNTYPEOBJECT*/;

    /*IF:ARGUMENTS*/
    constructor(queryArgs?: _t_ARGUMENTINTERFACENAME_t_) {
        super();
        queryArgs && this.setArgs(queryArgs);
    }
    /*ENDIF:ARGUMENTS*/

    public setArgs(queryArgs: Partial<_t_ARGUMENTINTERFACENAME_t_>) {
        this.queryArgs = {...this.queryArgs, ...queryArgs};
    }

    protected toArgString(): string {
        const queryArgItems: string[] = [];
        for(const [argKey, argValue] of Object.entries(this.queryArgs)) {
            if (argValue) {
                queryArgItems.push(`${argKey}: ${this.argify(argValue)}`);
            }
        }

        if(queryArgItems.length > 0) {
            return `(${queryArgItems.join(', ')})`;
        }

        return '';
    }

    /*IF:RETURNTYPEOBJECT*/
    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    public returnFields(returnFieldsClosure: (r: _t_RETURNTYPEBUILDER_t_) => void): this {
        returnFieldsClosure(this.returnType);
        return this;
    }
    /*ENDIF:RETURNTYPEOBJECT*/

    /*IF:ADDEXECUTOR*/
    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    async /*IGNORE*/execute/*ENDIGNORE*//*EXECUTIONFUNCTIONNAME*/(requestOptions: RequestOptions = {}): Promise<_t_QUERYCLASSNAME_t_Response> {
        return <_t_QUERYCLASSNAME_t_Response>(await super.execute(requestOptions));
    }
    /*ENDIF:ADDGET*/
}
