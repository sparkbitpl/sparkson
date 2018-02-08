import {ValidationRule} from "./ValidationRule";

export function addValidationRule(target: Object, paramIndex: number, rule: ValidationRule) {
    const metaKey = "validation:" + paramIndex
    let validationRules = Reflect.getMetadata(metaKey, target);
    if (!validationRules) {
        validationRules = [];
    }
    validationRules.push(rule);
    Reflect.defineMetadata(metaKey, validationRules, target);

}