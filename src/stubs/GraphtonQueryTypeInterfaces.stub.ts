/*IGNORE*/
import { AxiosRequestConfig } from "axios";
import {RootType} from './GraphtonBaseQuery.stub';
/*ENDIGNORE*/

export interface GraphtonQueryBuilder {
    queryName: string;
    rootType: RootType;
}

export interface GraphtonQuery<T> extends GraphtonQueryBuilder {
    /*IGNORE*/execute/*ENDIGNORE*//*QueryFunction*/(requestConfig?: AxiosRequestConfig): Promise<T>;
}

export interface GraphtonMutation<T> extends GraphtonQueryBuilder {
    /*IGNORE*/execute/*ENDIGNORE*//*MutateFunction*/(requestConfig?: AxiosRequestConfig): Promise<T>;
}

/*IF:Subscriptions*/
export interface GraphtonSubscription<T> extends GraphtonQueryBuilder {
    /*IGNORE*/execute/*ENDIGNORE*//*SubscribeFunction*/(requestConfig?: AxiosRequestConfig): Promise<T>;
}
/*ENDIF:Subscriptions*/
