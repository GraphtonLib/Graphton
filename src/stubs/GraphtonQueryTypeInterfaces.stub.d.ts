import { RequestOptions } from './GraphtonTypes.stub';
export interface GraphtonQuery<T> {
    execute(requestOptions?: RequestOptions): Promise<T>;
}
export interface GraphtonMutation<T> {
    execute(requestOptions?: RequestOptions): Promise<T>;
}
export interface GraphtonSubscription<T> {
    execute(requestOptions?: RequestOptions): Promise<T>;
}
