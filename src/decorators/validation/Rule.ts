import {addValidationRule} from "./ValidationHelper";
import {ValidationRule} from "./ValidationRule";

export function Rule(customRule: ValidationRule) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        addValidationRule(target, parameterIndex, customRule);
    };
}
