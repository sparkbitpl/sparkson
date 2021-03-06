Sparkson
========

Sparkson is a JSON parsing and validation library for TypeScript. It’s primary
goal is to ensure that payloads of REST APIs fulfill the promised contracts. It
provides a declarative interface based on decorators to specify the parsing and
validation rules.

Example
-------

Let us assume that we are building an application that consumes an API `GET /authors/:id`
with the following payload:

```json
{
    "first_name": "Jules",
    "last_name": "Verne",
    "books": [
        {
            "title": "Journey to the Center of the Earth",
            "publication_year": 1864,
            "original_title": "Voyage au centre de la Terre",
            "unstructured_data": {
                "original_book_cover_artist": "Édouard Riou",
                "first_english_publication_year": 1871
            }
        },
        {
            "title": "The Mysterious Island",
            "publication_year": 1875
        },
    ]
}
```
Using Sparkson, we can parse this payload to the following TypeScript model classes:
```typescript
import {ArrayField, Field, RawJsonField} from "sparkson";

export class Book {
    constructor(
        @Field("title") public title: string,
        @Field("publication_year") public publicationYear: number,
        @Field("original_title", true) public originalTitle?: string,
        @RawJsonField("unstructured_data", true) public additionalData: any
    ) {}
}

export class Author {
    constructor(
        @Field("first_name") public firstName: string,
        @Field("last_name") public lastName: string,
        @ArrayField("books", Book) public books: Book[]
    ) {}
}

```
Note the usage of two Sparkson annotations: `@Field` and `@ArrayField`. `@Field` can be attached
to a property of simple type (string, boolean, number) or to a nested object. It accepts two arguments:
  - the name of the property in JSON. This allows us to name the properties in model objects differently than in the JSON
  - whether the property is optional

Sparkson will check if:
  - there is a property of the given name in the JSON payload
  - the property has the correct type

If a mandatory property is missing, or it has an incorrect type, Sparkson will raise an error. The error message
will contain the location and type of the encountered problem.

`@ArrayField` accepts and additional parameter - type of the array elements. Without this parameter Sparkson would not be able
to validate the type of the array elements.

`@RawJsonField` is used for unstructured data. `@RawJsonField` cast the json to the desired type - it does not use desired type's constructor. That means it's not possible to call methods on an argument deserialized using `@RawJsonField`.

Parsing
-----
Now, we can parse the service response in the following way:
```typescript
import {parse} from "sparkson";

fetch("/authors/123").then((response) => {
    // TypeScript will infere here that author is of type Author
    const author = parse(Author, response.json());
});
```
If the JSON to parse is an array, we should use `parseArray` instead:

```typescript
import {parseArray} from "sparkson"

const books = parseArray(Book, [
    {
        "title": "Journey to the Center of the Earth",
        "publication_year": 1864,
        "original_title": "Voyage au centre de la Terre",
        "unstructured_data": {
            "original_book_cover_artist": "Édouard Riou",
            "first_english_publication_year": 1871
        }
    },
    {
        "title": "The Mysterious Island",
        "publication_year": 1875
    }]);
    // TypeScript will infere that books is of type Book[]
```

Mapping Dates
-----
Sparkson can automatically parse dates:
```json
{
    "some_date": "2018-02-01"
}
```
In the model object, the date needs to be declared as `sparkson.DateClass` (which extends standard `Date`):
```typescript
import {DateClass, Field} from "sparkson";

export class Example {
    constructor(@Field("some_date") public someDate: DateClass) {}
}

```
Custom Mappers
-----
Sparkson provides a mechanism for defining custom mappings. For example, imagine that your API returns some big numbers encoded as
strings:
```json
{
    "big_number": "123456789123456789"
}
```
which you'd like to parse into a `BigNumber` class:
```typescript
import {BigNumber} from "bignumber";

export class Response {
    constructor(@Field("big_number") public num: BigNumber) {}
}
```
Register a mapping from `string` to `BigNumber` in the following way:
```typescript
import {registerStringMapping} from "sparkson";
import {BigNumber} from "bignumber";
registerStringMapping(BigNumber, (val: string) => new BigNumber(val));
```
and Sparkson will parse the object for you.

Validation
-----
Sparkson supports validation of parameter values. It provides the following validation decorators:
 - `@Min(value)` - checks if the parameter value is not smaller than `value`
 - `@Max(value)` - checks if the parameter value is not greater than `value`
 - `@MinLength(value)` - checks if length of a string parameter is not smaller than `value`
 - `@MaxLength(value)` - checks if length of a string parameter is not greater than `value`
 - `@Before(date)` - checks if a date parameter is before `date`
 - `@After(date)` - checks if a date parameter is after `date`
 - `@Rule(customFn)` - checks if the parameter passes custom validation function. The validation function should have signature `(val: any) => string`.
 It should return either `null` (if the parameters passes the validation) or an error message
 - `@Regexp(expr)` - checks if a string parameter matches the given regular expression `expr`


The validation decorators can be applied either to a parameter of simple type or to an array parameter.
In the latter case, all values within the array must satisfy the validation rule. It is possible to apply
more than one validation rule to the same parameter, as can be seen in the following example:
```typescript
import {ArrayField, Field, Max, Min, Regexp, Rule} from "sparkson";

function ensureEven(value: number) {
    if (value % 2 === 0) {
        return null;
    }
    return "Even number required";
}

export class ValidateMe {
    constructor(
        @Field("in_range") @Min(1) @Max(5) public inRange: number,
        @Field("even") @Rule(ensureEven) public even: number,
        @ArrayField("values", string) @Regexp(/ab.*/) public values: string[]
    ) {}
}

```