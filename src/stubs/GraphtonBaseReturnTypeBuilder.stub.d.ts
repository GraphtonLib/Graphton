declare type AvailableFieldBuilderConstructor<T> = {
    [Property in keyof T]: new () => T[Property];
};
declare type QueryObjectFields<T> = {
    [Property in keyof T]?: T[Property];
};
export declare abstract class GraphtonBaseReturnTypeBuilder<ObjectField extends Record<keyof ObjectField, GraphtonBaseReturnTypeBuilder<any, any>>, SimpleField> {
    protected abstract availableSimpleFields: Set<SimpleField>;
    protected querySimpleFields: Set<SimpleField>;
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
    with(...fieldNames: SimpleField[]): this;
    /**
     * Remove `...fieldNames` from selection
     */
    without(...fieldNames: SimpleField[]): this;
    /**
     * Alias for .all().without(...fieldNames)
     */
    except(...fieldNames: SimpleField[]): this;
    /**
     * Alias for .clear().with(...fieldNames)
     */
    only(...fieldNames: SimpleField[]): this;
    /**
     * Add the `relatedType` OBJECT field, selecting the fields for that type using the `buildFields` closure
     */
    withRelated<ObjectFieldName extends keyof ObjectField>(relatedType: ObjectFieldName, buildFields: (r: ObjectField[ObjectFieldName]) => void): this;
    /**
     * Remove the `relatedType` OBJECT field
     * Selected fields for `relatedType` will be removed!
     */
    withoutRelated<ObjectFieldName extends keyof ObjectField>(relatedType: ObjectFieldName): this;
    /**
     * Compile the selected fields to a GraphQL selection.
     */
    toReturnTypeString(): string;
}
export {};
