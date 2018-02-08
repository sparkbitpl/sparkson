import * as _ from "lodash";
import {addValidationRule} from "./ValidationHelper";

export function MinLength(value: number) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const minValidator = (fieldValue) => {

            if (fieldValue.length && fieldValue.length < value) {
                return `Value cannot be shorter than ${value}`;
            }
            return null;
        }
        addValidationRule(target, parameterIndex, minValidator);
    };
}
