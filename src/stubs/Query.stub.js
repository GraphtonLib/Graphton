/*IGNORE*/
import { GraphtonBaseQuery } from './GraphtonBaseQuery.stub.js';
import { __TYPENAME__ReturnTypeBuilder as __RETURNTYPEBUILDER__ } from './ReturnTypeBuilder.stub.js';
/*ENDIF:ARGUMENTS*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class __QUERYCLASSNAME__ extends GraphtonBaseQuery {
    queryName = '/*QUERYNAME*/';
    queryArgs = {};
    rootType = '/*ROOTTYPE*/';
    returnType = /*IF:RETURNTYPEOBJECT*/ new /*ENDIF:RETURNTYPEOBJECT*/ __RETURNTYPEBUILDER__ /*IF:RETURNTYPEOBJECT*/() /*ENDIF:RETURNTYPEOBJECT*/;
    /*IF:ARGUMENTS*/
    constructor(queryArgs) {
        super();
        queryArgs && this.setArgs(queryArgs);
    }
    /*ENDIF:ARGUMENTS*/
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
    /*IF:ADDGET*/
    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    async get(requestOptions = {}) {
        return (await super.execute(requestOptions));
    }
    /*ENDIF:ADDGET*/
    /*IF:ADDDO*/
    /**
     * Do the mutation on the server
     * Only available on Mutation type requests
     */
    async do(requestOptions = {}) {
        return (await super.execute(requestOptions));
    }
}
