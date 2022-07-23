/*IGNORE*/
import { applyMixins, GraphtonBaseQuery, GraphtonQueryHasArguments } from "./GraphtonBaseQuery.stub";
import { AxiosRequestConfig, AxiosResponse } from "axios";

class X {}
/*ENDIGNORE*/

/*IF:AddExecutor*/
export interface _t_QueryClassName_t_Response {
    data: {
        /*QueryName*//*!: !*//*ReturnType*//*!;!*/
    };
}
/*ENDIF:AddExecutor*/

/*IF:HasArguments*/
export interface _t_ArgumentType_t_ {
    /*ArgumentTypeFields*//*IGNORE*/[key: string]: string|boolean|number/*ENDIGNORE*/;
}
/*ENDIF:HasArguments*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class _t_QueryClassName_t_ extends GraphtonBaseQuery<_t_QueryClassName_t_Response> /*IF:AddExecutor*//*!implements!*/ /*Implements*//*ENDIF:AddExecutor*/ {
    public readonly queryName = '/*QueryName*/';
    public readonly rootType = '/*RootType*/';
    /*IF:ReturnsObject*/protected readonly returnType = '/*ReturnTypeName*/';/*ENDIF:ReturnsObject*/

    /*IF:AddExecutor*/
    /**
     * Execute the query and get the results
     */
    async /*IGNORE*/execute/*ENDIGNORE*//*ExecutionFunctionName*/(requestConfig: AxiosRequestConfig = {}): Promise<_t_QueryClassName_t_Response & { [p:string]: any; axiosResponse: AxiosResponse; }> {
        return (await super.execute(requestConfig));
    }
    /*ENDIF:AddExecutor*/
}

/*IF:Extends*/
interface _t_QueryClassName_t_ extends /*Extends*//*IGNORE*/X/*ENDIGNORE*/ {
    /*IF:ReturnsObject*/initGraphtonQueryReturnsObject(): void;/*ENDIF:ReturnsObject*/
    /*IF:ReturnsObject*/toReturnString(): string;/*ENDIF:ReturnsObject*/
    /*IF:HasArguments*/toArgString(): string;/*ENDIF:HasArguments*/
}
applyMixins(_t_QueryClassName_t_, [/*ExtendsWithoutGenerics*//*IGNORE*/X/*ENDIGNORE*/]);
/*ENDIF:Extends*/
