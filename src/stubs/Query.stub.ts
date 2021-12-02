type __QUERYCLASSNAME__AvailableFields = '/**FIELDSTUPLE**/';
class __QUERYCLASSNAME__ extends GraphtonBaseQuery {
    protected availableFields: Set<string> = new Set(/*FIELDS*/);
    protected queryName = '/*QUERYNAME*/';

    // Builder essentials
    protected queryFields: Set<string> = new Set(/*FIELDS*/);
    protected arguments = {};

    constructor(/*ARGUMENTS*/) {
        super();
    }

    withFields(...fieldNames: (__QUERYCLASSNAME__AvailableFields|__QUERYCLASSNAME__AvailableFields[])[]): this {
        return super.withFields(...fieldNames);
    }
    withField(fieldName: __QUERYCLASSNAME__AvailableFields): this {
        return super.withField(fieldName);
    }
    withoutFields(...fieldNames: (__QUERYCLASSNAME__AvailableFields|__QUERYCLASSNAME__AvailableFields[])[]): this {
        return super.withoutFields(...fieldNames);
    }
    withoutField(fieldName: __QUERYCLASSNAME__AvailableFields): this {
        return super.withoutField(fieldName);
    }
    except(...fieldNames: (__QUERYCLASSNAME__AvailableFields|__QUERYCLASSNAME__AvailableFields[])[]): this {
        return super.except(...fieldNames);
    }
    only(...fieldNames: (__QUERYCLASSNAME__AvailableFields|__QUERYCLASSNAME__AvailableFields[])[]): this {
        return super.only(...fieldNames);
    }
}
