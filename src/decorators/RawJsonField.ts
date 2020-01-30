export function RawJsonField(jsonProperty: string, optional = false, defaultValue = undefined) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        /*tslint:disable no-any*/
        (<any>Reflect).defineMetadata("field:" + parameterIndex, {propName: jsonProperty, optional: optional, rawValue: true, defaultValue: defaultValue}, target);
        /*tslint:enable no-any*/
    };
}
