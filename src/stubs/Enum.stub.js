/*IGNORE*/
import { GraphtonBaseEnum } from './GraphtonBaseEnum.stub';
/*ENDIGNORE*/
export class _t_EnumClassName_t_ extends GraphtonBaseEnum {
    /*EnumValues*/
    static possibleValues = { /*PossibleValues*/};
    constructor(value) {
        super(value);
    }
    static parse(value) {
        return _t_EnumClassName_t_.possibleValues[value];
    }
    static list() {
        return Object.values(_t_EnumClassName_t_.possibleValues);
    }
}
