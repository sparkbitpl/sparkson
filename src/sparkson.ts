export {DateClass} from "./core/DateClass";
export {JsonParseError, JsonParseErrorCode} from "./core/JsonParseError";
export {parse, parseArray, registerStringMapper, registerBooleanMapper, registerNumberMapper} from "./core/parser";
export {RefType} from "./core/RefType";

export {ArrayField} from "./decorators/ArrayField";
export {Field} from "./decorators/Field";
export {RawJsonField} from "./decorators/RawJsonField";

export {Min} from "./decorators/validation/Min";
export {Max} from "./decorators/validation/Max";

export {MinLength} from "./decorators/validation/MinLength";
export {MaxLength} from "./decorators/validation/MaxLength";
export {Regexp} from "./decorators/validation/Regexp";

export {After} from "./decorators/validation/After";
export {Before} from "./decorators/validation/Before";

export {Rule} from "./decorators/validation/Rule";

export {Registrable} from "./decorators/Registrable";

declare function require(moduleName: string): any;

if (!Reflect || !Reflect.defineMetadata) {
    require("reflect-metadata");
}

