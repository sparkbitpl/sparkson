export {DateClass} from "./core/DateClass";
export {JsonParseError} from "./core/JsonParseError";
export {parse, parseArray} from "./core/parser";
export {RefType} from "./core/RefType";

export {ArrayField} from "./decorators/ArrayField";
export {Field} from "./decorators/Field";

export {Min} from "./decorators/validation/Min";
export {Max} from "./decorators/validation/Max";

export {MinLength} from "./decorators/validation/MinLength";
export {MaxLength} from "./decorators/validation/MaxLength";
export {Regexp} from "./decorators/validation/Regexp";

export {After} from "./decorators/validation/After";
export {Before} from "./decorators/validation/Before";

export {Email} from "./decorators/validation/Email";
export {Rule} from "./decorators/validation/Rule";

declare function require(moduleName: string): any;

if (!Reflect || !Reflect.defineMetadata) {
    require("reflect-metadata");
}

