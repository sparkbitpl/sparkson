import * as r from "reflect-metadata";

const RANGE = 10_000_000;

export function Registrable<T>(ctor: new(...args: any[]) => T) {
    const sid = Math.floor(Math.random() * RANGE + 1).toString();    
    (<any>Reflect).defineMetadata("sparksonRegistrable", sid, ctor);
    return undefined;
}
