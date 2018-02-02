export interface RefType<T> extends Function {
    /*tslint:disable no-any*/
    new(...args: any[]): T;
    /*tslint:enable no-any*/
}
