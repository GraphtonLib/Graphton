/*IGNORE*/
import {GraphtonBaseReturnTypeBuilder} from "./GraphtonBaseReturnTypeBuilder.stub.js";
/*ENDIGNORE*/


type __TYPENAME__ReturnTypeSimpleField = '/**SIMPLEFIELDTUPLE**/';
type __TYPENAME__ReturnTypeObjectField = '/**OBJECTFIELDTUPLE**/';

/*IGNORE*/export/*ENDIGNORE*/class __TYPENAME__ReturnTypeBuilder extends GraphtonBaseReturnTypeBuilder {
    protected availableSimpleFields = new Set([/**SIMPLEFIELDARRAY**/]);
    protected availableObjectFields = {/**OBJECTFIELDOBJECT**/};
    protected typeName = '/*TYPENAME*/';

    public with(...fieldNames: (__TYPENAME__ReturnTypeSimpleField|__TYPENAME__ReturnTypeSimpleField[])[]): this {
        return super.with(...fieldNames);
    }
    public without(...fieldNames: (__TYPENAME__ReturnTypeSimpleField|__TYPENAME__ReturnTypeSimpleField[])[]): this {
        return super.without(...fieldNames);
    }
    public except(...fieldNames: (__TYPENAME__ReturnTypeSimpleField|__TYPENAME__ReturnTypeSimpleField[])[]): this {
        return super.except(...fieldNames);
    }
    public only(...fieldNames: (__TYPENAME__ReturnTypeSimpleField|__TYPENAME__ReturnTypeSimpleField[])[]): this {
        return super.only(...fieldNames);
    }
    /*WITHRELATEDOVERLOADS*/
    public withRelated(relatedType: __TYPENAME__ReturnTypeObjectField, buildFields: (r: GraphtonBaseReturnTypeBuilder) => void): this {
        return super.withRelated(relatedType, buildFields);
    }
    public withoutRelated(relatedType: __TYPENAME__ReturnTypeObjectField): this {
        return super.withoutRelated(relatedType);
    }
}
