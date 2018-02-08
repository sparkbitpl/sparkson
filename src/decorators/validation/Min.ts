import * as _ from "lodash";
import {addValidationRule} from "./ValidationHelper";

export function Min(value: number) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const minValidator = (fieldValue: number) => {
            if (fieldValue < value) {
                return `Value cannot be smaller than ${value}`;
            }
            return null;
        }
        addValidationRule(target, parameterIndex, minValidator);
    };
}
