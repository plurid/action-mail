<p align="center">
    <a target="_blank" href="https://plurid.com/action-mail">
        <img src="https://raw.githubusercontent.com/plurid/action-mail/master/about/identity/action-mail-logo.png" height="250px">
    </a>
    <br />
    <br />
    <a target="_blank" href="https://github.com/plurid/action-mail/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-DEL-blue.svg?colorB=1380C3&style=for-the-badge" alt="License: DEL">
    </a>
</p>



<h1 align="center">
    action mail
</h1>


<h3 align="center">
    Act On Mails
</h3>


<br />



`action mail` provides a specification, parsing tools, and client mail utilities to obtain action entities and values from mails.

`action mail`s are intended to be used for `accountless interactions`.

An user is `accountless` when interacting with an internet service without being expressly identified to/for that service.

An user could desire to be `accountless` and at the same time be interested in a particular product offered by an internet service. They could even desire to purchase that particular product, but without going through the hassle of setting up an account, or exposing their favorite `login with` provider for just another, simple, one-time buy event. They want a `flea market-like economic transaction`, not to engage in a 12 year relationship with a prenuptial agreement and a tough divorce.



### Contents

+ [Usage](#usage)
    + [Dolphin example](#dolphin-example)
    + [World example](#world-example)
    + [Advanced](#advanced)
+ [Packages](#packages)
+ [Codeophon](#codeophon)



## Usage


In-browser `action mail`s are composed on the client-side using an anchor `a` tag with the `href` attribute set to `mailto`, where the query values of `subject` and `body` are `encodeURIComponent` strings with the text interspersing the `action mail` syntax.


### Dolphin example

Consider the following example with a `jsx` `BuyWithoutAccount` button

``` tsx
const mail = 'address@example.com';

const requestSubject = encodeURIComponent(
    `Hello from subject text`,
);

const requestBody = encodeURIComponent(
    `Hello,\n\nfrom body text\n{using} an {action: mail} to {specify: values} and {entities}.\n`,
);

const BuyWithoutAccount = () => (
    <a
        href={`mailto:${mail}?subject=${requestSubject}&body=${requestBody}`}
    >
        <button>
            Buy without Account
        </button>
    </a>
);
```

When the user clicks the button, the browser will open their default mail client with the `destination`, `subject`, and `body` text already filled, such as

```
To: address@example.com
Subject: Hello from subject text
Body: Hello,

from body text
{using} an {action: mail} to {specify: values} and {entities}.
```

After the mail reaches the destination, it will be parsed and the following data structures is obtained

``` json
{
    "using": true,
    "action": "mail",
    "specify": "values",
    "entities": true
}
```

The data structure can then be used to `POST` an API endpoint which will take care of responding accordingly to the `action mail`.

The mail client add-ons take care of parsing and calling the adequate API endpoint, with the appropriate authorization token.


### World example

A sales `action mail` could use the following `subject` and `body`.

``` typescript
const requestSubject = encodeURIComponent(
    `[Order] Product x1 for $100`,
);

const requestBody = encodeURIComponent(
`Hello,


I would like to order

    {Product: x1 · specifications: of product}

Please {send} me a payment link

and {do not generate} an account using this email.

Deliver with the following shipment details

    {name: }
    {country: }
    {city: }
    {street: }


Thanks
`,
);
```

which when parsed with the following settings

``` typescript
const data = requestSubject + requestBody;

const values = parser(
    data,
    {
        spacer: '·',
        fielders: [
            ['{', '}'],
            ['[', ']'],
        ],
        camelCaseKeys: true,
    },
);
```

obtains the data structure

``` json
{
    "order": true,
    "send": true,
    "generate": false,
    "name": "",
    "country": "",
    "city": "",
    "street": "",
    "groups": [
        {
            "product": "x1",
            "specifications": "of product"
        }
    ]
}
```

The user of the service only has to complete the `name`, `country`, `city`, `street` fields, or they could be automatically completed with predefined values if they also use the `action mail` mail client.


### Advanced

The parser options are

``` typescript
interface ParserOptions {
    /**
     * Delimiting string between multiple fields within the same action mail group.
     *
     * e.g. `{one: two · three: four}` with `·` as spacer.
     */
    spacer: string;

    /**
     * The name of the groups key.
     *
     * Default: `'groups'`
     */
    groupsKey: string;

    /**
     * Use `camelCase` for all the keys.
     */
    camelCaseKeys: boolean;

    /**
     * Field start-end pairs.
     *
     * The first element marks field start, the second element marks field end.
     *
     * Default `[ ['{', '}'] ]`.
     */
    fielders: string[][];
}
```



## Packages


<a target="_blank" href="https://www.npmjs.com/package/@plurid/action-mail-parser">
    <img src="https://img.shields.io/npm/v/@plurid/action-mail-parser.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/action-mail-parser][action-mail-parser] • parser

[action-mail-parser]: https://github.com/plurid/action-mail/tree/master/packages/action-mail-parser


[@plurid/action-mail-gmail][action-mail-gmail] • gmail mail client

[action-mail-gmail]: https://github.com/plurid/action-mail/tree/master/packages/action-mail-gmail



## [Codeophon](https://github.com/ly3xqhl8g9/codeophon)

+ licensing: [delicense](https://github.com/ly3xqhl8g9/delicense)
+ versioning: [αver](https://github.com/ly3xqhl8g9/alpha-versioning)
