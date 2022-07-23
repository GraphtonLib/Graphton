/*IGNORE*/
import {GraphtonBaseEnum} from './GraphtonBaseEnum.stub';
/*ENDIGNORE*/

export class _t_EnumClassName_t_ extends GraphtonBaseEnum {
    /*EnumValues*/
    static readonly possibleValues = {/*PossibleValues*/};

    private constructor(value: keyof typeof _t_EnumClassName_t_.possibleValues) {
        super(value);
    }

    public static parse(value: keyof typeof _t_EnumClassName_t_.possibleValues): _t_EnumClassName_t_ {
        return _t_EnumClassName_t_.possibleValues[value];
    }

    public static list(): _t_EnumClassName_t_[] {
        return Object.values(_t_EnumClassName_t_.possibleValues);
    }
}
