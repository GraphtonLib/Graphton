import { RequestOptions } from "./GraphtonTypes.stub";
import { RootType } from "./GraphtonBaseQuery.stub";
export interface GraphtonQueryBuilder {
  queryName: string;
  rootType: RootType;
}
export interface GraphtonQuery<T> extends GraphtonQueryBuilder {
  execute(requestOptions?: RequestOptions): Promise<T>;
}
export interface GraphtonMutation<T> extends GraphtonQueryBuilder {
  execute(requestOptions?: RequestOptions): Promise<T>;
}
export interface GraphtonSubscription<T> extends GraphtonQueryBuilder {
  execute(requestOptions?: RequestOptions): Promise<T>;
}
