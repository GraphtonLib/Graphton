declare const fieldObjectMap: Record<string, Record<string, string | null>>;
import type { AxiosRequestConfig, AxiosResponse } from "axios";
export declare function applyMixins(derivedCtor: any, constructors: any[]): void;
export declare type RootType = 'query' | 'mutation' | 'subscription' | '/*RootType*/';
export declare abstract class GraphtonBaseQuery<QueryResponse> {
    abstract readonly queryName: string;
    abstract readonly rootType: RootType;
    /**
     * Get the return object format
     */
    toReturnString(): string;
    /**
     * Transform arguments to string to use in query
     */
    protected toArgString(): string;
    /**
     * Transform query class to graphql query string
     */
    toQuery(): string;
    /**
     * Execute the query
     */
    protected execute(requestConfig?: AxiosRequestConfig): Promise<QueryResponse & {
        [p: string]: any;
        axiosResponse: AxiosResponse;
    }>;
}
declare type FieldSelectorTypeFormat = {
    [key: string]: ({} | FieldSelectorTypeFormat);
};
export declare abstract class GraphtonQueryReturnsObject<FieldSelectorType extends FieldSelectorTypeFormat, ReturnType extends {
    [p: string]: unknown;
}> {
    protected selectedFields: {
        root: Partial<FieldSelectorType>;
    };
    protected abstract readonly returnType: keyof typeof fieldObjectMap;
    /**
     * Select fields that should be returned
     */
    select(fields: Partial<FieldSelectorType>): this;
    protected doSelect(fields: Partial<FieldSelectorType>, selectionLevel: Partial<FieldSelectorTypeFormat>, lookupType?: keyof typeof fieldObjectMap): void;
    /**
     * Deselect fields that were returned.
     */
    deselect(fields: Partial<FieldSelectorType>): this;
    protected doDeselect(fields: Partial<FieldSelectorType>, selectionLevel: Partial<FieldSelectorTypeFormat>, subLevel?: string): void;
    toReturnString(): string;
    protected toReturnStringPart(part: Partial<FieldSelectorTypeFormat>): string;
}
export declare abstract class GraphtonQueryHasArguments<ArgumentType> {
    protected queryArgs: ArgumentType;
    /**
     * Set the arguments for this query
     */
    setArgs(queryArgs: ArgumentType): this;
    protected toArgString(): string;
    protected argify(argValue: unknown): string;
}
export {};
