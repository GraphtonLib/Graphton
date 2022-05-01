/*IGNORE*/
import { RequestOptions } from "./GraphtonTypes.stub";
import { RootType } from "./GraphtonBaseQuery.stub";
/*ENDIGNORE*/

export interface GraphtonQueryBuilder {
  queryName: string;
  rootType: RootType;
}

export interface GraphtonQuery<T> extends GraphtonQueryBuilder {
  /*IGNORE*/ execute(/*ENDIGNORE*/ /*QUERYFUNCTION*/ requestOptions?: RequestOptions): Promise<T>;
}

export interface GraphtonMutation<T> extends GraphtonQueryBuilder {
  /*IGNORE*/ execute(/*ENDIGNORE*/ /*MUTATEFUNCTION*/ requestOptions?: RequestOptions): Promise<T>;
}

/*IF:SUBSCRIPTIONS*/
export interface GraphtonSubscription<T> extends GraphtonQueryBuilder {
  /*IGNORE*/ execute(/*ENDIGNORE*/ /*SUBSCRIBEFUNCTION*/ requestOptions?: RequestOptions): Promise<T>;
}
/*ENDIF:SUBSCRIPTIONS*/
