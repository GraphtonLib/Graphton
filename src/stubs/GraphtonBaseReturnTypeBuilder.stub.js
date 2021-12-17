/*ENDIGNORE*/
/*IGNORE*/ export /*ENDIGNORE*/ class GraphtonBaseReturnTypeBuilder {
    querySimpleFields = new Set([]);
    queryObjectFields = {};
    /**
     * Select all known fields te be returned
     */
    all() {
        this.querySimpleFields = new Set(this.availableSimpleFields);
        return this;
    }
    /**
     * Clear all selected fields.
     */
    clear() {
        this.querySimpleFields.clear();
        return this;
    }
    /**
     * Select `...fieldNames` to be returned
     */
    with(...fieldNames) {
        for (const fieldName of fieldNames) {
            if (!this.availableSimpleFields.has(fieldName)) {
                console.warn(`Field "${fieldName}" might not exist in type "${this.typeName}"!`);
            }
            this.querySimpleFields.add(fieldName);
        }
        return this;
    }
    /**
     * Remove `...fieldNames` from selection
     */
    without(...fieldNames) {
        for (const fieldName of fieldNames) {
            this.querySimpleFields.delete(fieldName);
        }
        return this;
    }
    /**
     * Alias for .all().without(...fieldNames)
     */
    except(...fieldNames) {
        return this.all().without(...fieldNames);
    }
    /**
     * Alias for .clear().with(...fieldNames)
     */
    only(...fieldNames) {
        return this.clear().with(...fieldNames);
    }
    /**
     * Add the `relatedType` OBJECT field, selecting the fields for that type using the `buildFields` closure
     */
    withRelated(relatedType, buildFields) {
        const relatedReturnType = new this.queryObjectFieldBuilders[relatedType]();
        buildFields(relatedReturnType);
        this.queryObjectFields[relatedType] = relatedReturnType;
        return this;
    }
    /**
     * Remove the `relatedType` OBJECT field
     * Selected fields for `relatedType` will be removed!
     */
    withoutRelated(relatedType) {
        delete this.queryObjectFields[relatedType];
        return this;
    }
    /**
     * Compile the selected fields to a GraphQL selection.
     */
    toReturnTypeString() {
        if (this.querySimpleFields.size < 1 && Object.values(this.queryObjectFields).length < 1) {
            return '';
        }
        const returnTypeString = ['{', ...this.querySimpleFields];
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
