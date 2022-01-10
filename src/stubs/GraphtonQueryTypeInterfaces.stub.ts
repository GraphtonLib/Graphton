/*IGNORE*/
import {RequestOptions} from './GraphtonTypes.stub';
/*ENDIGNORE*/

export interface GraphtonQuery<T> {
    /*IGNORE*/execute/*ENDIGNORE*//*QUERYFUNCTION*/(requestOptions?: RequestOptions): Promise<T>;
}

export interface GraphtonMutation<T> {
    /*IGNORE*/execute/*ENDIGNORE*//*MUTATEFUNCTION*/(requestOptions?: RequestOptions): Promise<T>;
}

/*IF:SUBSCRIPTIONS*/
export interface GraphtonSubscription<T> {
    /*IGNORE*/execute/*ENDIGNORE*//*SUBSCRIBEFUNCTION*/(requestOptions?: RequestOptions): Promise<T>;
}
/*ENDIF:SUBSCRIPTIONS*/
