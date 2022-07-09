import { AvailableFieldBuilderConstructor, QueryObjectFields } from './GraphtonTypes.stub';
export declare abstract class GraphtonBaseReturnTypeBuilder<ObjectField extends Record<keyof ObjectField, GraphtonBaseReturnTypeBuilder<any, any>>, ScalarProperty> {
    protected abstract availableScalarProperties: Set<ScalarProperty>;
    protected queryScalarProperties: Set<ScalarProperty>;
    protected queryObjectFields: QueryObjectFields<ObjectField>;
    protected abstract queryObjectFieldBuilders: AvailableFieldBuilderConstructor<ObjectField>;
    protected abstract typeName: string;
    /**
     * Select all known fields te be returned
     */
    all(): this;
    /**
     * Clear all selected fields.
     */
    clear(): this;
    /**
     * Select `...fieldNames` to be returned
     */
    select(...fieldNames: ScalarProperty[]): this;
    /**
     * Select everything except `...fieldNames`
     */
    except(...fieldNames: ScalarProperty[]): this;
    /**
     * Select `...fieldNames` and remove the rest
     */
    only(...fieldNames: ScalarProperty[]): this;
    /**
     * Add the `relatedType` OBJECT field, selecting the fields for that type using the `buildFields` closure
     */
    with<ObjectFieldName extends keyof ObjectField>(relatedType: ObjectFieldName, buildFields: (r: ObjectField[ObjectFieldName]) => void): this;
    /**
     * Remove the `relatedType` OBJECT field
     * Selected fields for `relatedType` will be removed!
     */
    without<ObjectFieldName extends keyof ObjectField>(relatedType: ObjectFieldName): this;
    /**
     * Compile the selected fields to a GraphQL selection.
     */
    toReturnTypeString(): string;
}
