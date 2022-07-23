/*IGNORE*/
import { applyMixins, GraphtonBaseQuery } from "./GraphtonBaseQuery.stub";
class X {
}
/*ENDIF:HasArguments*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class _t_QueryClassName_t_ extends GraphtonBaseQuery /*IF:AddExecutor*/ /*!implements!*/ /*Implements*/ /*ENDIF:AddExecutor*/ {
    queryName = '/*QueryName*/';
    rootType = '/*RootType*/';
    /*IF:ReturnsObject*/ returnType = '/*ReturnTypeName*/'; /*ENDIF:ReturnsObject*/
    /*IF:AddExecutor*/
    /**
     * Execute the query and get the results
     */
    async /*IGNORE*/ execute /*ENDIGNORE*/ /*ExecutionFunctionName*/(requestConfig = {}) {
        return (await super.execute(requestConfig));
    }
}
applyMixins(_t_QueryClassName_t_, [/*ExtendsWithoutGenerics*/ /*IGNORE*/ X /*ENDIGNORE*/]);
/*ENDIF:Extends*/
