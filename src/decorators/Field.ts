import * as _ from "lodash";
import {GenericTypes} from "../core/GenericTypes";
import * as r from "reflect-metadata";

export function Field(jsonProperty: string, optional = false, genericTypes: GenericTypes = null) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        /*tslint:disable no-any*/
        (<any>Reflect).defineMetadata("field:" + parameterIndex, {propName: jsonProperty, optional: optional}, target);
        if (genericTypes) {
            _.keys(genericTypes.types).forEach(id => {
                (<any>Reflect).defineMetadata("generic:" + jsonProperty, genericTypes, target);
            })
        }
        /*tslint:enable no-any*/
    };
}
