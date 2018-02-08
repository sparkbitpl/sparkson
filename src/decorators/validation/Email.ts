import {validate} from "isemail";
import {addValidationRule} from "./ValidationHelper";

export function Email() {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const emailValidator = (fieldValue: string) => {
            if (!validate(fieldValue)) {
                return `Value must be an email address`;
            }
            return null;
        }
        addValidationRule(target, parameterIndex, emailValidator);
    };
}
