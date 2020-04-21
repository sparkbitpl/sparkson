import {addValidationRule} from "./ValidationHelper";

export function Regexp(value: RegExp) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const regexValidator = (fieldValue: string) => {
            if (!value.test(fieldValue)) {
                return `Value must match regular expression ${value}`;
            }
            return null;
        }
        addValidationRule(target, parameterIndex, regexValidator);
    };
}
