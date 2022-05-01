/*IGNORE*/
import { GraphtonEnum } from "./GraphtonBaseEnum.stub";
/*ENDIGNORE*/
export class _t_ENUMCLASSNAME_t_ extends GraphtonEnum {
  /*ENUMVALUES*/
  static possibleValues = {
    /*POSSIBLEVALUES*/
  };
  constructor(value) {
    super(value);
  }
  static parse(value) {
    return _t_ENUMCLASSNAME_t_.possibleValues[value];
  }
  static list() {
    return Object.values(_t_ENUMCLASSNAME_t_.possibleValues);
  }
}
