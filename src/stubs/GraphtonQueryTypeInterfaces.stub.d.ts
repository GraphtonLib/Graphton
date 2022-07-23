import { AxiosRequestConfig } from "axios";
import { RootType } from './GraphtonBaseQuery.stub';
export interface GraphtonQueryBuilder {
    queryName: string;
    rootType: RootType;
}
export interface GraphtonQuery<T> extends GraphtonQueryBuilder {
    execute(requestConfig?: AxiosRequestConfig): Promise<T>;
}
export interface GraphtonMutation<T> extends GraphtonQueryBuilder {
    execute(requestConfig?: AxiosRequestConfig): Promise<T>;
}
export interface GraphtonSubscription<T> extends GraphtonQueryBuilder {
    execute(requestConfig?: AxiosRequestConfig): Promise<T>;
}
