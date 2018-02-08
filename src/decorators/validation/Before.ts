import * as _ from "lodash";
import {addValidationRule} from "./ValidationHelper";
import * as dateUtils from "../../utils/DateUtils";

export function Before(value: string | Date) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const beforeValidator = (fieldValue: any) => {
            let valueDate: Date = null;
            if (value instanceof Date) {
                valueDate = value;
            } else {
                valueDate = dateUtils.parseDate(value);
            }
            if (fieldValue.getTime !== undefined && fieldValue.getTime() >= valueDate.getTime()) {
                return `Value must be before ${value}`;
            }
            return null;
        }
        addValidationRule(target, parameterIndex, beforeValidator);
    };
}
