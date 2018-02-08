import "jasmine";
import "reflect-metadata";
import {DateClass, Field, ArrayField, Max, Min,
    MinLength, MaxLength, parse, JsonParseError} from "../src/sparkson"

// auxiliary model classes
class Simple {
    constructor(@Field("someString") public str: string, @Field("someNumber") public num: number, @Field("someBoolean") public b: boolean) {}
}

class WithDate {
    constructor(@Field("date") public date: DateClass) {}
}

class WithOptional {
    constructor(@Field("str") public str: string, @Field("obj", true) public obj: Simple, @Field("num", true) public num = 11) {}
}

class WithArray {
    constructor(@ArrayField("someArray", String) public elems: Array<string>) {}
}

class Recursive {
    constructor(@Field("name") public name: string, @Field("next", true) public next?: Recursive) {}
}

class OptionalDate {
    constructor(@Field("optional", true) public date?: DateClass) {}
}

class WithMin {
    constructor(@Field("value") @Min(3) public value: number) {}
}

class WithMax {
    constructor(@Field("value") @Max(3) public value: number) {}
}

class WithMinMax {
    constructor(@Field("value") @Min(1) @Max(3) public value: number) {}
}

class WithMinOnArray {
    constructor(@ArrayField("values", Number) @Min(1) public values: number[]) {}
}

class WithMinLength {
    constructor(@Field("value") @MinLength(3) public value: string) {}
}

class WithMaxLength {
    constructor(@Field("value") @MaxLength(3) public value: string) {}
}

describe("sparkson", () => {
    it("should pass @Min validation", () => {
        let validated = parse(WithMin, {value: 4});
        expect(validated.value).toBe(4);
    });

    it("should fail @Max validation", () => {
        expect(() => parse(WithMax, {value: 4})).toThrow(jasmine.any(JsonParseError));
    });

    it("should pass @MinLength validation", () => {
        let validated = parse(WithMinLength, {value: "abcd"});
        expect(validated.value).toBe("abcd");
    });

    it("should fail @MinLength validation", () => {
        expect(() => parse(WithMinLength, {value: "ab"})).toThrow(jasmine.any(JsonParseError));
    });

    it("should pass @MaxLength validation", () => {
        let validated = parse(WithMaxLength, {value: "ab"});
        expect(validated.value).toBe("ab");
    });

    it("should fail @MaxLength validation", () => {
        expect(() => parse(WithMaxLength, {value: "abcd"})).toThrow(jasmine.any(JsonParseError));
    });

    it("should pass @Max validation", () => {
        let validated = parse(WithMax, {value: 2});
        expect(validated.value).toBe(2);
    });

    it("should pass @Min and @Max validation", () => {
        let validated = parse(WithMinMax, {value: 2});
        expect(validated.value).toBe(2);
    });

    it("should fail @Min validation", () => {
        expect(() => parse(WithMin, {value: 2})).toThrow(jasmine.any(JsonParseError));
    });

    it("should pass @Min validation on an array", () => {
        let validated = parse(WithMinOnArray, {values: [5, 6, 7, 8]});
        expect(1).toBe(1); // just expect that there was no error
    });

    it("should fail @Min validation on an array", () => {
        expect(() => parse(WithMinOnArray, {values: [7, 8, -10, 12]})).toThrow(jasmine.any(JsonParseError));
    });


    it("should parse a simple object", () => {
        let simple = parse(Simple, {someString: "foo", someNumber: 42, someBoolean: true});
        expect(simple.str).toBe("foo");
        expect(simple.num).toBe(42);
        expect(simple.b).toBeTruthy();
    });

    it("should parse a date", () => {
        let withDate = parse(WithDate, {date: "2018-02-03"});
        expect(withDate.date.getFullYear()).toEqual(2018);
        expect(withDate.date.getMonth()).toEqual(1);
        expect(withDate.date.getDate()).toEqual(3);
        expect(withDate.date.getHours()).toEqual(0);
    });

    it("should parse a date with time", () => {
        let withDate = parse(WithDate, {date: "2018-02-03T11:15:21+01:00"});
        expect(withDate.date.getFullYear()).toEqual(2018);
        expect(withDate.date.getMonth()).toEqual(1);
        expect(withDate.date.getDate()).toEqual(3);
        expect(withDate.date.getUTCHours()).toEqual(10);
        expect(withDate.date.getMinutes()).toEqual(15);
        expect(withDate.date.getSeconds()).toEqual(21);
    });

    it("should parse an object with optional params", () => {
        let simple = parse(WithOptional, {str: "foo"});
        expect(simple.str).toBe("foo");
        expect(simple.obj).toBe(undefined); // set undefined, when no default value is supplied
        expect(simple.num).toBe(11); // keep the default value
    });

    it("should parse a simple string array", () => {
        let tmp = parse(WithArray, {someArray: ["foo", "bar"]});
        expect(tmp.elems[0]).toBe("foo");
        expect(tmp.elems[1]).toBe("bar");
    });

    it("should handle recursive type", () => {
        let tmp = parse(Recursive, {
            name: "foo",

            next: {
                name: "bar",
                next: {
                    name: "baz"
                }
            }
        });
        expect(tmp.name).toBe("foo");
        expect(tmp.next.name).toBe("bar");
        expect(tmp.next.next.name).toBe("baz");
        expect(tmp.next.next.next).toBe(undefined);
    });

    it("should throw an error when wrong simple type is encountered", () => {
        expect(() => parse(Simple, {someString: 42, someNumber: 42, someBoolean: true})).toThrow(jasmine.any(JsonParseError));
        expect(() => parse(Simple, {someString: "foo", someNumber: "foo", someBoolean: true})).toThrow(jasmine.any(JsonParseError));
        expect(() => parse(Simple, {someString: "foo", someNumber: 42, someBoolean: 42})).toThrow(jasmine.any(JsonParseError));
    });

    it("should throw an error when mandatory property is missing", () => {
        expect(() => parse(Simple, {someString: "foo"})).toThrow(jasmine.any(JsonParseError));
    });

    it("should allow for optional dates", () => {
        const obj = parse(OptionalDate, {});
        expect(obj.date).toBeUndefined();
    })
})