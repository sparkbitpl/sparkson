import {RefType} from "./RefType";

export class GenericTypes {
    /*tslint:disable no-any*/
    constructor(public types: {[key: string]: RefType<any>}) {}
    /*tslint:enable no-any*/
}
