export declare function isUrl(urlString: string): boolean;
export declare function fillStub(stub: string, substitutions?: Record<string, string>, conditions?: string[]): string;
declare type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export declare function httpRequest<T>(method: HttpMethod, url: string, data: Record<string, unknown>, headers?: Record<string, string>): Promise<T>;
export {};
