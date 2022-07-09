/*IGNORE*/
import {AvailableFieldBuilderConstructor, QueryObjectFields} from './GraphtonTypes.stub';
/*ENDIGNORE*/

/*IGNORE*/export /*ENDIGNORE*/abstract class GraphtonBaseReturnTypeBuilder<ObjectField extends Record<keyof ObjectField, GraphtonBaseReturnTypeBuilder<any,any>>, ScalarProperty> {
    protected abstract availableScalarProperties: Set<ScalarProperty>;
    protected queryScalarProperties: Set<ScalarProperty> = new Set([]);
    protected queryObjectFields: QueryObjectFields<ObjectField> = {};
    protected abstract queryObjectFieldBuilders: AvailableFieldBuilderConstructor<ObjectField>;
    protected abstract typeName: string;

    /**
     * Select all known fields te be returned
     */
    public all(): this {
        this.queryScalarProperties = new Set(this.availableScalarProperties);
        return this;
    }

    /**
     * Clear all selected fields.
     */
    public clear(): this {
        this.queryScalarProperties.clear();
        return this;
    }

    /**
     * Select `...fieldNames` to be returned
     */
    public select(...fieldNames: ScalarProperty[]): this {
        for(const fieldName of fieldNames) {
            if(!this.availableScalarProperties.has(fieldName)) {
                console.warn(`Field "${fieldName}" might not exist in type "${this.typeName}"!`);
            }

            this.queryScalarProperties.add(fieldName);
        }

        return this;
    }

    /**
     * Select everything except `...fieldNames`
     */
    public except(...fieldNames: ScalarProperty[]): this {
        return this.clear().select(...[...this.availableScalarProperties].filter(f => fieldNames.indexOf(f) < 0));
    }

    /**
     * Select `...fieldNames` and remove the rest
     */
    public only(...fieldNames: ScalarProperty[]): this {
        return this.clear().select(...fieldNames);
    }

    /**
     * Add the `relatedType` OBJECT field, selecting the fields for that type using the `buildFields` closure
     */
    public with<ObjectFieldName extends keyof ObjectField>(relatedType: ObjectFieldName, buildFields: (r: ObjectField[ObjectFieldName]) => void): this {
        const relatedReturnType = new this.queryObjectFieldBuilders[relatedType]();
        buildFields(relatedReturnType);
        this.queryObjectFields[relatedType] = relatedReturnType;

        return this;
    }

    /**
     * Remove the `relatedType` OBJECT field
     * Selected fields for `relatedType` will be removed!
     */
    public without<ObjectFieldName extends keyof ObjectField>(relatedType: ObjectFieldName): this {
        delete this.queryObjectFields[relatedType];

        return this;
    }

    /**
     * Compile the selected fields to a GraphQL selection.
     */
    public toReturnTypeString(): string {
        if(this.queryScalarProperties.size < 1 && Object.values(this.queryObjectFields).length < 1) {
            return '';
        }

        const returnTypeString = ['{', ...this.queryScalarProperties];

        for(const [objectType, objectField] of Object.entries(this.queryObjectFields)) {
            const objectFieldReturnTypeString = (<GraphtonBaseReturnTypeBuilder<any,any>>objectField).toReturnTypeString();
            if(objectFieldReturnTypeString.length > 0) {
                returnTypeString.push(objectType, objectFieldReturnTypeString);
            }
        }

        returnTypeString.push('}');

        return returnTypeString.join(' ');
    }
}
