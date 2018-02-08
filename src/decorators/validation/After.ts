import * as _ from "lodash";
import {addValidationRule} from "./ValidationHelper";
import * as dateUtils from "../../utils/DateUtils";

export function After(value: string | Date) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const afterValidator = (fieldValue: any) => {
            let valueDate: Date = null;
            if (value instanceof Date) {
                valueDate = value;
            } else {
                valueDate = dateUtils.parseDate(value);
            }
            if (fieldValue.getTime !== undefined && fieldValue.getTime() <= valueDate.getTime()) {
                return `Value must be after ${value}`;
            }
            return null;
        }
        addValidationRule(target, parameterIndex, afterValidator);
    };
}
