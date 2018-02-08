import * as _ from "lodash";
import {addValidationRule} from "./ValidationHelper";

export function Max(value: number) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const maxValidator = (fieldValue: number) => {
            if (fieldValue > value) {
                return `Value cannot be greater than ${value}`;
            }
            return null;
        }
        addValidationRule(target, parameterIndex, maxValidator);
    };
}
