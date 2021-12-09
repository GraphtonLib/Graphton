import { GraphtonBaseReturnTypeBuilder } from './GraphtonBaseReturnTypeBuilder.stub.js';
interface __TYPENAME__ReturnTypeBuilderObjectBuilder {
}
declare type __TYPENAME__ReturnTypeSimpleField = '/**SIMPLEFIELDLITERALS**/';
export declare class __TYPENAME__ReturnTypeBuilder extends GraphtonBaseReturnTypeBuilder<__TYPENAME__ReturnTypeBuilderObjectBuilder, __TYPENAME__ReturnTypeSimpleField> {
    protected availableSimpleFields: Set<__TYPENAME__ReturnTypeSimpleField>;
    protected typeName: string;
    protected queryObjectFieldBuilders: {};
}
export {};
