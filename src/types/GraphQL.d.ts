export interface QueryType {
    name: string;
}

export interface MutationType {
    name: string;
}

export interface ReturnType {
    kind: string;
    name: string;
    ofType?: ReturnType;
}

export interface Arg {
    name: string;
    description: string;
    type: ReturnType;
    defaultValue: string;
}

export interface Field {
    name: string;
    description: string;
    args: Arg[];
    type: ReturnType;
    isDeprecated: boolean;
    deprecationReason?: any;
}

export interface InputField {
    name: string;
    description: string;
    type: ReturnType;
    defaultValue?: any;
}

export interface EnumValue {
    name: string;
    description: string;
    isDeprecated: boolean;
    deprecationReason?: any;
}

export interface Type {
    kind: string;
    name: string;
    description: string;
    fields: Field[];
    inputFields: InputField[];
    interfaces: any[];
    enumValues: EnumValue[];
    possibleTypes?: any;
}

export interface Directive {
    name: string;
    description: string;
    locations: string[];
    args: Arg[];
}

export interface Schema {
    queryType: QueryType;
    mutationType: MutationType;
    subscriptionType?: any;
    types: Type[];
    directives: Directive[];
}

export interface RetrospectionResponse {
    data: {
        __schema: Schema
    }
}
