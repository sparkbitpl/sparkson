export {DateClass} from "./core/DateClass";
export {JsonParseError} from "./core/JsonParseError";
export {parse, parseArray} from "./core/parser";
export {RefType} from "./core/RefType";

export {ArrayField} from "./decorators/ArrayField";
export {Field} from "./decorators/Field";

export {Min} from "./decorators/validation/Min";
export {Max} from "./decorators/validation/Max";

declare function require(moduleName: string): any;

if (!Reflect || !Reflect.defineMetadata) {
    require("reflect-metadata");
}

