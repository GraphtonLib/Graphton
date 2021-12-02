type __QUERYCLASSNAME__AvailableFields = '/**FIELDSTUPLE**/';
interface __QUERYCLASSNAME__Response {
    data/*RETURNTYPE*/,
    response: AxiosResponse
}
class __QUERYCLASSNAME__ extends GraphtonBaseQuery {
    protected availableFields: Set<string> = new Set(/*FIELDS*/);
    protected queryName: string = '/*QUERYNAME*/';
    // Builder essentials
    protected queryFields: Set<string> = new Set([]);
    protected arguments: Record<string, any> = {};
    protected rootType: 'query'|'mutation' = '/*ROOTTYPE*/';
    constructor(/*TYPEDPARAMS*/) {
        super();
        this.arguments = {/*PARAMS*/};
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
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
    async get(requestOptions: RequestOptions = {}): Promise<__QUERYCLASSNAME__Response> {
        return <__QUERYCLASSNAME__Response>(await super.execute());
    }
    async do(requestOptions: RequestOptions = {}): Promise<__QUERYCLASSNAME__Response> {
        return <__QUERYCLASSNAME__Response>(await super.execute());
    }
}
