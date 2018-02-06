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
            "original_title": "Voyage au centre de la Terre"
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
import {ArrayField, Field} from "sparkson";

export class Book {
    constructor(
        @Field("title") public title: string,
        @Field("publication_year") public publicationYear: number,
        @Field("original_title", true) public originalTitle?: string
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
        "original_title": "Voyage au centre de la Terre"
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