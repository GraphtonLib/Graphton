/*IGNORE*/
import { GraphtonEnum } from "./GraphtonBaseEnum.stub";
/*ENDIGNORE*/

export class _t_ENUMCLASSNAME_t_ extends GraphtonEnum {
  /*ENUMVALUES*/
  static readonly possibleValues = {
    /*POSSIBLEVALUES*/
  };

  private constructor(value: keyof typeof _t_ENUMCLASSNAME_t_.possibleValues) {
    super(value);
  }

  public static parse(value: keyof typeof _t_ENUMCLASSNAME_t_.possibleValues): _t_ENUMCLASSNAME_t_ {
    return _t_ENUMCLASSNAME_t_.possibleValues[value];
  }

  public static list(): _t_ENUMCLASSNAME_t_[] {
    return Object.values(_t_ENUMCLASSNAME_t_.possibleValues);
  }
}
