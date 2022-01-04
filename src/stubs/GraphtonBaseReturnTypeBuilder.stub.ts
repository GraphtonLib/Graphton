/*IGNORE*/
import {AvailableFieldBuilderConstructor, QueryObjectFields} from './GraphtonTypes.stub';
/*ENDIGNORE*/

/*IGNORE*/export /*ENDIGNORE*/abstract class GraphtonBaseReturnTypeBuilder<ObjectField extends Record<keyof ObjectField, GraphtonBaseReturnTypeBuilder<any,any>>, SimpleField> {
    protected abstract availableSimpleFields: Set<SimpleField>;
    protected querySimpleFields: Set<SimpleField> = new Set([]);
    protected queryObjectFields: QueryObjectFields<ObjectField> = {};
    protected abstract queryObjectFieldBuilders: AvailableFieldBuilderConstructor<ObjectField>;
    protected abstract typeName: string;

    /**
     * Select all known fields te be returned
     */
    public all(): this {
        this.querySimpleFields = new Set(this.availableSimpleFields);
        return this;
    }

    /**
     * Clear all selected fields.
     */
    public clear(): this {
        this.querySimpleFields.clear();
        return this;
    }

    /**
     * Select `...fieldNames` to be returned
     */
    public select(...fieldNames: SimpleField[]): this {
        for(const fieldName of fieldNames) {
            if(!this.availableSimpleFields.has(fieldName)) {
                console.warn(`Field "${fieldName}" might not exist in type "${this.typeName}"!`);
            }

            this.querySimpleFields.add(fieldName);
        }

        return this;
    }

    /**
     * Select everything except `...fieldNames`
     */
    public except(...fieldNames: SimpleField[]): this {
        return this.clear().select(...[...this.querySimpleFields].filter(f => fieldNames.indexOf(f) > -1));
    }

    /**
     * Select `...fieldNames` and remove the rest
     */
    public only(...fieldNames: SimpleField[]): this {
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
        if(this.querySimpleFields.size < 1 && Object.values(this.queryObjectFields).length < 1) {
            return '';
        }

        const returnTypeString = ['{', ...this.querySimpleFields];

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
