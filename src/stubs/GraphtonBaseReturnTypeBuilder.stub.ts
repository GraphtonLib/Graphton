/*IGNORE*/export/*ENDIGNORE*/abstract class GraphtonBaseReturnTypeBuilder {
    protected abstract availableSimpleFields: Set<string>;
    protected abstract availableObjectFields: Record<string, new() => GraphtonBaseReturnTypeBuilder>;
    protected querySimpleFields: Set<string> = new Set([]);
    protected queryObjectFields: Record<string, GraphtonBaseReturnTypeBuilder> = {};
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
    public with(...fieldNames: (string|string[])[]): this {
        const flatFieldNames = fieldNames.flat();
        for(const fieldName of flatFieldNames) {
            if(!this.availableSimpleFields.has(fieldName)) {
                console.warn(`Field "${fieldName}" might not exist in type "${this.typeName}"!`);
            }

            this.querySimpleFields.add(fieldName);
        }

        return this;
    }

    /**
     * Remove `...fieldNames` from selection
     */
    public without(...fieldNames: (string|string[])[]): this {
        const flatFieldNames = fieldNames.flat();
        for(const fieldName of flatFieldNames) {
            this.querySimpleFields.delete(fieldName);
        }

        return this;
    }

    /**
     * Alias for .all().without(...fieldNames)
     */
    public except(...fieldNames: (string|string[])[]): this {
        return this.all().without(...fieldNames);
    }

    /**
     * Alias for .clear().with(...fieldNames)
     */
    public only(...fieldNames: (string|string[])[]): this {
        return this.clear().with(...fieldNames);
    }

    /**
     * Add the `relatedType` OBJECT field, selecting the fields for that type using the `buildFields` closure
     */
    public withRelated(relatedType: string, buildFields: (r: GraphtonBaseReturnTypeBuilder) => void): this {
        const relatedReturnTypeClass = this.availableObjectFields[relatedType];
        if(!relatedReturnTypeClass) {
            console.warn(`Trying to add related field ${relatedType} to type ${this.typeName} which does not exist. Ignoring!`);
            return this;
        }

        const relatedReturnType = new relatedReturnTypeClass();
        buildFields(relatedReturnType);
        this.queryObjectFields[relatedType] = relatedReturnType;

        return this;
    }

    /**
     * Remove the `relatedType` OBJECT field
     * Selected fields for `relatedType` will be removed!
     */
    public withoutRelated(relatedType: string): this {
        delete this.queryObjectFields[relatedType];

        return this;
    }

    /**
     * Compile the selected fields to a GraphQL selection.
     */
    public toReturnTypeString(): string {
        if(this.querySimpleFields.size < 1 && Object.values(this.queryObjectFields).length < 1) {
            return ``;
        }

        let returnTypeString = ['{', ...this.querySimpleFields];

        for(const [objectType, objectField] of Object.entries(this.queryObjectFields)) {
            let objectFieldReturnTypeString = objectField.toReturnTypeString();
            if(objectFieldReturnTypeString.length > 0) {
                returnTypeString.push(objectType, objectFieldReturnTypeString);
            }
        }

        returnTypeString.push('}');

        return returnTypeString.join(' ');
    }
}
