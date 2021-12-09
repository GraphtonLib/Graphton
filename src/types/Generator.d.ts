export interface GenerateCommandOptions {
    outputFile: string,
    types: boolean,
    exportQueryFactoryAs: string,
    exportMutationFactoryAs: string,
}

export interface ReturnTypeInfo {
    type: string,
    notNull: boolean,
    isListOf: boolean,
    listNotNull?: boolean,
    kind: 'simple'|'object',
}

export type FactoryTypeName = 'Mutation'|'Query'|'Subscription';
