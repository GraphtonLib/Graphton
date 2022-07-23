/*IGNORE*/
import { GraphtonSettings } from "./Settings.stub";
import { GraphtonBaseEnum } from "./GraphtonBaseEnum.stub";
const fieldObjectMap = {};
/*ENDIGNORE*/
import axios from "axios";
/*IGNORE*/ export /*ENDIGNORE*/ function applyMixins(derivedCtor, constructors) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                Object.create(null));
        });
    });
}
export class GraphtonBaseQuery {
    constructor() {
        this.initGraphtonQueryReturnsObject();
    }
    initGraphtonQueryReturnsObject() { }
    /**
     * Get the return object format
     */
    toReturnString() {
        return '';
    }
    /**
     * Transform arguments to string to use in query
     */
    toArgString() {
        return '';
    }
    /**
     * Transform query class to graphql query string
     */
    toQuery() {
        return `${this.rootType} ${this.queryName} { ${this.queryName}${this.toArgString()} ${this.toReturnString()} }`;
    }
    /**
     * Execute the query
     */
    async execute(requestConfig = {}) {
        if (requestConfig.headers) {
            requestConfig.headers = {
                ...requestConfig.headers,
                'Content-Type': 'application/json',
            };
        }
        const response = await axios.post(GraphtonSettings.graphqlEndpoint, { query: this.toQuery() }, {
            headers: {
                'Content-Type': 'application/json',
                ...GraphtonSettings.headers,
            },
            ...requestConfig
        });
        const returnData = {
            ...response.data,
            axiosResponse: response
        };
        if (returnData.errors) {
            return Promise.reject(returnData);
        }
        return returnData;
    }
}
export class GraphtonQueryReturnsObject {
    selectedFields;
    returnType;
    initGraphtonQueryReturnsObject() {
        this.selectedFields = { root: {} };
    }
    /**
     * Select fields that should be returned
     */
    select(fields) {
        this.doSelect(fields, this.selectedFields.root);
        return this;
    }
    doSelect(fields, selectionLevel, lookupType = this.returnType) {
        for (let [field, subSelection] of Object.entries(fields)) {
            if (field === "_all") {
                Object.entries(fieldObjectMap[lookupType]).filter(([, v]) => v === null).forEach(([k]) => selectionLevel[k] = {});
            }
            else {
                if (subSelection === undefined)
                    continue;
                let lookupField = fieldObjectMap[lookupType][field];
                if (!selectionLevel[field])
                    selectionLevel[field] = {};
                if (Object.keys(subSelection).length > 0 && typeof (lookupField) === "string") {
                    this.doSelect(subSelection, selectionLevel[field], lookupField);
                }
            }
        }
    }
    /**
     * Deselect fields that were returned.
     */
    deselect(fields) {
        this.doDeselect(fields, this.selectedFields);
        return this;
    }
    doDeselect(fields, selectionLevel, subLevel = 'root') {
        for (let [field, subSelection] of Object.entries(fields)) {
            if (field === "_all") {
                delete selectionLevel[subLevel];
            }
            else {
                if (subSelection === undefined)
                    continue;
                let selectionSubLevel = selectionLevel[subLevel];
                if (Object.keys(subSelection).length > 0) {
                    this.doDeselect(subSelection, selectionSubLevel, field);
                    if (Object.keys(selectionSubLevel).length < 1) {
                        delete selectionSubLevel[field];
                    }
                }
                else {
                    delete selectionSubLevel[field];
                }
            }
        }
    }
    toReturnString() {
        return `{ ${this.toReturnStringPart(this.selectedFields.root)} }`;
    }
    toReturnStringPart(part) {
        let toReturn = [];
        for (let [field, subSelection] of Object.entries(part)) {
            if (!subSelection)
                continue;
            toReturn.push(field);
            if (Object.keys(subSelection).length > 0) {
                toReturn.push(`{ ${this.toReturnStringPart(subSelection)} }`);
            }
        }
        return toReturn.join(' ');
    }
}
export class GraphtonQueryHasArguments {
    queryArgs;
    /**
     * Set the arguments for this query
     */
    setArgs(queryArgs) {
        this.queryArgs = queryArgs;
        return this;
    }
    ;
    toArgString() {
        const queryArgItems = [];
        for (const [argKey, argValue] of Object.entries(this.queryArgs)) {
            try {
                queryArgItems.push(`${argKey}: ${this.argify(argValue)}`);
            }
            catch (e) {
                console.warn(e);
            }
        }
        if (queryArgItems.length > 0) {
            return `(${queryArgItems.join(', ')})`;
        }
        return '';
    }
    argify(argValue) {
        if (argValue instanceof GraphtonBaseEnum) {
            return `${argValue}`;
        }
        if (Array.isArray(argValue)) {
            return `[${argValue.map(v => this.argify(v))}]`;
        }
        if (typeof argValue === 'object' && !Array.isArray(argValue) && argValue !== null) {
            const decoded = [];
            for (const [key, value] of Object.entries(argValue)) {
                decoded.push(`${key}: ${this.argify(value)}`);
            }
            return `{${decoded.join(',')}}`;
        }
        if (typeof argValue === 'string' || typeof argValue === 'number' || typeof argValue === 'boolean' || argValue === null) {
            return JSON.stringify(argValue);
        }
        throw new Error(`Unsure how to argify ${argValue} (of type ${typeof argValue}).`);
    }
}
