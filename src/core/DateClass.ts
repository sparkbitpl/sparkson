import {Registrable} from "../decorators/Registrable";
/**
 * Date is an interface so type information won't be available at runtime.
 * We need type information in classes processed by JsonParser
 */
@Registrable
export class DateClass extends Date {
    public static type = "DateClass";
}