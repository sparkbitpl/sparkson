import * as _ from "lodash";
import {addValidationRule} from "./ValidationHelper";

export function MaxLength(value: number) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const minValidator = (fieldValue) => {

            if (fieldValue.length !== undefined && fieldValue.length > value) {
                return `Value cannot be longer than ${value}`;
            }
            return null;
        }
        addValidationRule(target, parameterIndex, minValidator);
    };
}
