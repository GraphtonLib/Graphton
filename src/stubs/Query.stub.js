/*IGNORE*/
import { GraphtonBaseQuery } from './GraphtonBaseQuery.stub.js';
import { _t_TYPENAME_t_ReturnTypeBuilder as _t_RETURNTYPEBUILDER_t_ } from './ReturnTypeBuilder.stub.js';
/*ENDIF:ARGUMENTS*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class _t_QUERYCLASSNAME_t_ extends GraphtonBaseQuery /*IF:ADDEXECUTOR*/ /*!implements!*/ /*IMPLEMENTS*/ /*ENDIF:ADDEXECUTOR*/ {
    queryName = '/*QUERYNAME*/';
    rootType = '/*ROOTTYPE*/';
    queryArgs = {};
    returnType = /*IF:RETURNTYPEOBJECT*/ new /*ENDIF:RETURNTYPEOBJECT*/ _t_RETURNTYPEBUILDER_t_ /*IF:RETURNTYPEOBJECT*/() /*ENDIF:RETURNTYPEOBJECT*/;
    /*IF:ARGUMENTS*/
    constructor(queryArgs) {
        super();
        queryArgs && this.setArgs(queryArgs);
    }
    /*ENDIF:ARGUMENTS*/
    setArgs(queryArgs) {
        this.queryArgs = { ...this.queryArgs, ...queryArgs };
    }
    toArgString() {
        const queryArgItems = [];
        for (const [argKey, argValue] of Object.entries(this.queryArgs)) {
            if (argValue) {
                queryArgItems.push(`${argKey}: ${this.argify(argValue)}`);
            }
        }
        if (queryArgItems.length > 0) {
            return `(${queryArgItems.join(', ')})`;
        }
        return '';
    }
    /*IF:RETURNTYPEOBJECT*/
    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    returnFields(returnFieldsClosure) {
        returnFieldsClosure(this.returnType);
        return this;
    }
    /*ENDIF:RETURNTYPEOBJECT*/
    /*IF:ADDEXECUTOR*/
    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    async /*IGNORE*/ execute /*ENDIGNORE*/ /*EXECUTIONFUNCTIONNAME*/(requestOptions = {}) {
        return (await super.execute(requestOptions));
    }
}
