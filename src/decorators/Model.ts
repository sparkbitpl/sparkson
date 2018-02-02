import * as r from "reflect-metadata";

console.log(r);
export function Model() {
    return (target: Function) => {
        /*tslint:disable no-any*/
        (<any>Reflect).defineMetadata("@Model", true, target);
        /*tslint:enable no-any*/
    };
}
