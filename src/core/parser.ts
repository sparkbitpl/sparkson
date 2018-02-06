import * as _ from "lodash";
import {RefType} from "./RefType";
import {GenericTypes} from "./GenericTypes";
import {JsonParseError, JsonParseErrorCode} from "./JsonParseError";

/*tslint:disable no-any*/

    function tryReadField <T>(jsonValue: any, matchesType: (fieldVal: any) => boolean,
        convert: (field: any) => T, error: () => JsonParseError): any {
            if (matchesType(jsonValue)){
                return convert(jsonValue);
            }
            throw error();
    }

    function parseValue(cls: RefType<any>, json: Object, spec: {propName: string, type?: RefType<any>, optional: boolean},
        prefix: string, genericTypes?: GenericTypes): any {
        function propName() {
            return prefix + "/" + spec.propName;
        }

        if (spec.optional && (json === undefined) || json === null) {
            return undefined;
        }
        const expectedTypeName = getName(cls);
        switch (expectedTypeName) {
            case "String":
                return tryReadField(json, fieldValue => typeof fieldValue === "string",
                    fieldValue => <string> fieldValue,
                    () => new JsonParseError("Expected a string value for property " + propName(), JsonParseErrorCode.INVALID_TYPE));
            case "Number":
                return tryReadField(json, fieldValue => typeof fieldValue === "number",
                    fieldValue => <number> fieldValue,
                    () => new JsonParseError("Expected a number value for property " + propName(), JsonParseErrorCode.INVALID_TYPE));
            case "Boolean":
                return tryReadField(json, fieldValue => typeof fieldValue === "boolean",
                    fieldValue => <boolean> fieldValue,
                    () => new JsonParseError("Expected a boolean value for property " + propName(), JsonParseErrorCode.INVALID_TYPE));
            case "DateClass":
                const regExp = /(\d{4})-(\d{2})(?:-(\d{2}))?.*/;
                return tryReadField(json, fieldValue => {
                        return regExp.test(fieldValue);
                    },
                    fieldValue => {
                        const [ , year, month, day] = regExp.exec(fieldValue);
                        if (!_.isUndefined(day)) {
                            return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
                        } else {
                            return new Date(parseInt(year, 10), parseInt(month, 10) - 1);
                        }
                    },
                    () => new JsonParseError("Expected a Date object for property " + propName(), JsonParseErrorCode.INVALID_TYPE));
            case "Array":
                if (!spec.type) {
                    throw new JsonParseError("Missing type annotation for array property " + propName(), JsonParseErrorCode.INVALID_TYPE);
                }
                return tryReadField(json, fieldValue => _.isArray(fieldValue),
                    fieldValue => (<Array<any>>fieldValue).map((arrayElem, idx) => parseValue(spec.type, arrayElem, {propName: "[" + idx + "]", optional: false},
                        prefix + "/" + spec.propName, genericTypes)),
                    () => new JsonParseError("Expected an array for property " + propName(), JsonParseErrorCode.INVALID_TYPE));
            default:
                return doParse(cls, json, prefix + "/" + spec.propName, genericTypes);
        }
    }
    function doParse(cls: RefType<any>, json: Object, prefix: string, genericTypes?: GenericTypes): any {
        let getMetadata = (<any>Reflect).getMetadata;
        if (isSimpleType(cls)) {
            return parseValue(cls, json, {propName: "array", type: cls, optional: true}, prefix);
        }
        let constructorParams = <Array<RefType<any>>> _.clone(getMetadata("design:paramtypes", cls));
        if (!constructorParams) {
            throw new JsonParseError("Missing constructor for type " + cls["name"], JsonParseErrorCode.INVALID_MODEL_CLASS);
        }
        let jsonProps = _.times(constructorParams.length).map(n => <string> getMetadata("field:" + n, cls));
        if (genericTypes) {
            jsonProps.forEach((prop, n) => {
                let spec = <any> prop;
                if (genericTypes.types[spec.propName] && constructorParams[n] === Object) {
                    constructorParams[n] = genericTypes.types[spec.propName];
                }
            });
        }
        let copyParams = <Array<RefType<any>>> getMetadata("design:paramtypes", cls);
        let generics = _.times(constructorParams.length).map(n => getGenericMetadata(jsonProps, n, cls, getMetadata));
        let values = _.zip<any>(jsonProps, constructorParams, generics).map(data => {
            let spec = <{propName: string, type?: RefType<any>, optional: boolean}> data[0];
            let param = <RefType<any>> data[1];
            let genericTypes = data[2];
            if (!spec || !spec.propName) {
                throw new JsonParseError("Missing @Field annotation in type " + getName(cls), JsonParseErrorCode.MISSING_ANNOTATION);
            }
            //support for variant names like "foo | bar | baz"
            const propNames = spec.propName.split("|").map(p => p.trim());
            let innerJson = undefined;
            for (let i = 0; i < propNames.length; i++) {
                if (json.hasOwnProperty(propNames[i])) {
                    innerJson = json[propNames[i]];
                    break;
                }
            }
            if (!innerJson === undefined && !spec.optional) {
                throw new JsonParseError("Missing property " + spec.propName + " at path " + prefix, JsonParseErrorCode.MISSING_PROPERTY);
            }

            return parseValue(param, innerJson, spec, prefix, genericTypes);
        });
        return new cls(...values);
    }

    function getGenericMetadata(props, index, cls, getMetadata) {
        if (props && props[index] && props[index].propName) {
            return <string>getMetadata("generic:" + props[index].propName, cls);
        }
    }
    function getName<T>(cls: RefType<T>) {
        if (cls["type"]) {
            return cls["type"];
        }
        if (cls["name"]) {
            return cls["name"];
        }
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec(cls.toString());
        return (results && results.length > 1) ? results[1] : "";
    }

    function isSimpleType(cls: RefType<any>) {
        let typeName = getName(cls);
        return typeName === "String" || typeName === "Number" || typeName === "Boolean" || typeName == "DateClass";
    }

export function parse<T>(cls : RefType<T>, json: object): T {
    return parseValue(cls, json, {propName: ".", optional: false}, "");
}
export function parseArray<T>(cls: RefType<T>, json: object, optional = false): T[] {
    if (json === null && optional) {
        return [];
    }
    return parseValue(Array, json, {propName: ".", optional: optional, type: cls}, "");
}
/*tslint:enable no-any*/
