/*IGNORE*/
import { GraphtonSettings } from "./Settings.stub";
import { GraphtonBaseEnum } from "./GraphtonBaseEnum.stub";
const fieldObjectMap: Record<string, Record<string, string|null>> = {};
/*ENDIGNORE*/

import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

/*IGNORE*/export /*ENDIGNORE*/function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
              derivedCtor.prototype,
              name,
              Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
              Object.create(null)
            );
        });
    });
}

/*IGNORE*/export /*ENDIGNORE*/type RootType = 'query'|'mutation'|'subscription'/*IGNORE*/|'/*RootType*/'/*ENDIGNORE*/;

type ReturnObject = { [p: string]: string | ReturnObject };
export abstract class GraphtonBaseQuery<QueryResponse> {
    public abstract readonly queryName: string;
    public abstract readonly rootType: RootType;

    constructor() {
        this.initGraphtonQueryReturnsObject();
    }

    protected initGraphtonQueryReturnsObject(): void {}

    /**
     * Get the return object format
     */
    public toReturnString(): string {
        return '';
    }

    /**
     * Transform arguments to string to use in query
     */
    protected toArgString(): string {
        return '';
    }

    /**
     * Transform query class to graphql query string
     */
    public toQuery(): string {
        return `${this.rootType} ${this.queryName} { ${this.queryName}${this.toArgString()} ${this.toReturnString()} }`;
    }

    /**
     * Execute the query
     */
    protected async execute(requestConfig: AxiosRequestConfig = {}): Promise<QueryResponse & { [p:string]: any; axiosResponse: AxiosResponse; }> {
        if(requestConfig.headers) {
            requestConfig.headers = {
                ...requestConfig.headers,
                'Content-Type': 'application/json',
            }
        }

        const response = await axios.post(GraphtonSettings.graphqlEndpoint, {query: this.toQuery()}, {
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

        if(returnData.errors) {
            return Promise.reject(returnData);
        }

        return returnData;
    }
}

type FieldSelectorTypeFormat = { [key: string]: ({} | FieldSelectorTypeFormat); };
export abstract class GraphtonQueryReturnsObject<FieldSelectorType extends FieldSelectorTypeFormat, ReturnType extends { [p: string]: unknown }> {
    protected selectedFields!: {root: Partial<FieldSelectorType>};
    protected readonly returnType!: keyof typeof fieldObjectMap;

    protected initGraphtonQueryReturnsObject(): void {
        this.selectedFields = {root: {}};
    }

    /**
     * Select fields that should be returned
     */
    public select(fields: Partial<FieldSelectorType>): this {
        this.doSelect(fields, this.selectedFields.root);

        return this;
    }

    protected doSelect(
      fields: Partial<FieldSelectorType>,
      selectionLevel: Partial<FieldSelectorTypeFormat>,
      lookupType: keyof typeof fieldObjectMap = this.returnType
    ) {
        for(let [field, subSelection] of Object.entries(fields)) {
            if(field === "_all") {
                Object.entries(fieldObjectMap[lookupType]).filter(([,v]) => v === null).forEach(([k]) => selectionLevel[k] = {});
            } else {
                if(subSelection === undefined) continue;

                let lookupField = fieldObjectMap[lookupType][field];
                if(!selectionLevel[field]) selectionLevel[field] = {};
                if(Object.keys(subSelection).length > 0 && typeof(lookupField) === "string") {
                    this.doSelect(subSelection, selectionLevel[field] as Partial<FieldSelectorTypeFormat>, lookupField);
                }
            }
        }
    }


    /**
     * Deselect fields that were returned.
     */
    public deselect(fields: Partial<FieldSelectorType>): this {
        this.doDeselect(fields, this.selectedFields);

        return this;
    }

    protected doDeselect(
      fields: Partial<FieldSelectorType>,
      selectionLevel: Partial<FieldSelectorTypeFormat>,
      subLevel: string = 'root'
    ) {
        for(let [field, subSelection] of Object.entries(fields)) {
            if(field === "_all") {
                delete selectionLevel[subLevel];
            } else {
                if(subSelection === undefined) continue;

                let selectionSubLevel = selectionLevel[subLevel] as Partial<FieldSelectorTypeFormat>;
                if(Object.keys(subSelection).length > 0) {
                    this.doDeselect(subSelection, selectionSubLevel, field);
                    if(Object.keys(selectionSubLevel).length < 1) {
                        delete selectionSubLevel[field];
                    }
                } else {
                    delete selectionSubLevel[field];
                }
            }
        }
    }

    public toReturnString(): string {
        return `{ ${this.toReturnStringPart(this.selectedFields.root)} }`;
    }

    protected toReturnStringPart(part: Partial<FieldSelectorTypeFormat>) {
        let toReturn: string[] = [];

        for(let [field, subSelection] of Object.entries(part)) {
            if(!subSelection) continue;

            toReturn.push(field);
            if(Object.keys(subSelection).length > 0) {
                toReturn.push(`{ ${this.toReturnStringPart(subSelection)} }`);
            }
        }

        return toReturn.join(' ');
    }
}


export abstract class GraphtonQueryHasArguments<ArgumentType> {
    protected queryArgs!: ArgumentType;

    /**
     * Set the arguments for this query
     */
    public setArgs(queryArgs: ArgumentType): this {
        this.queryArgs = queryArgs;

        return this;
    };

    protected toArgString(): string {
        const queryArgItems: string[] = [];
        for(const [argKey, argValue] of Object.entries(this.queryArgs)) {
            try {
                queryArgItems.push(`${argKey}: ${this.argify(argValue)}`);
            } catch (e) {
                console.warn(e);
            }
        }

        if(queryArgItems.length > 0) {
            return `(${queryArgItems.join(', ')})`;
        }

        return '';
    }

    protected argify(argValue: unknown): string {
        if(argValue instanceof GraphtonBaseEnum) {
            return `${argValue}`;
        }
        if(Array.isArray(argValue)) {
            return `[${argValue.map(v=>this.argify(v))}]`;
        }
        if(typeof argValue === 'object' && !Array.isArray(argValue) && argValue !== null) {
            const decoded: string[] = [];
            for(const [key, value] of Object.entries(argValue)) {
                decoded.push(`${key}: ${this.argify(value)}`);
            }
            return `{${decoded.join(',')}}`;
        }
        if(typeof argValue === 'string' || typeof argValue === 'number' || typeof argValue === 'boolean' || argValue === null) {
            return JSON.stringify(argValue);
        }

        throw new Error(`Unsure how to argify ${argValue} (of type ${typeof argValue}).`);
    }
}

