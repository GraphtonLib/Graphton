/*ENDIGNORE*/
/*IGNORE*/ export /*ENDIGNORE*/ class GraphtonBaseReturnTypeBuilder {
    queryScalarProperties = new Set([]);
    queryObjectFields = {};
    /**
     * Select all known fields te be returned
     */
    all() {
        this.queryScalarProperties = new Set(this.availableScalarProperties);
        return this;
    }
    /**
     * Clear all selected fields.
     */
    clear() {
        this.queryScalarProperties.clear();
        return this;
    }
    /**
     * Select `...fieldNames` to be returned
     */
    select(...fieldNames) {
        for (const fieldName of fieldNames) {
            if (!this.availableScalarProperties.has(fieldName)) {
                console.warn(`Field "${fieldName}" might not exist in type "${this.typeName}"!`);
            }
            this.queryScalarProperties.add(fieldName);
        }
        return this;
    }
    /**
     * Select everything except `...fieldNames`
     */
    except(...fieldNames) {
        return this.clear().select(...[...this.availableScalarProperties].filter(f => fieldNames.indexOf(f) < 0));
    }
    /**
     * Select `...fieldNames` and remove the rest
     */
    only(...fieldNames) {
        return this.clear().select(...fieldNames);
    }
    /**
     * Add the `relatedType` OBJECT field, selecting the fields for that type using the `buildFields` closure
     */
    with(relatedType, buildFields) {
        const relatedReturnType = new this.queryObjectFieldBuilders[relatedType]();
        buildFields(relatedReturnType);
        this.queryObjectFields[relatedType] = relatedReturnType;
        return this;
    }
    /**
     * Remove the `relatedType` OBJECT field
     * Selected fields for `relatedType` will be removed!
     */
    without(relatedType) {
        delete this.queryObjectFields[relatedType];
        return this;
    }
    /**
     * Compile the selected fields to a GraphQL selection.
     */
    toReturnTypeString() {
        if (this.queryScalarProperties.size < 1 && Object.values(this.queryObjectFields).length < 1) {
            return '';
        }
        const returnTypeString = ['{', ...this.queryScalarProperties];
        for (const [objectType, objectField] of Object.entries(this.queryObjectFields)) {
            const objectFieldReturnTypeString = objectField.toReturnTypeString();
            if (objectFieldReturnTypeString.length > 0) {
                returnTypeString.push(objectType, objectFieldReturnTypeString);
            }
        }
        returnTypeString.push('}');
        return returnTypeString.join(' ');
    }
}
