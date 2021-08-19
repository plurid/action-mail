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



`action mail` provides a specification, parsing tools, and mail client utilities to obtain `action entities` and/or `action variables` from mails, messages, or other user input.

`action entities` have `true` or `false` values. `action variables` have string values.

`action mail`s are intended to be used for `accountless interactions`, however the parsing functionality can be used to extract and perform actions for fully authenticated users using any realtime communication channel.

An user is `accountless` when interacting with an internet service without being expressly identified to/for that service.

An user could desire to be `accountless` and at the same time be interested in a particular product offered by an internet service. They could even desire to purchase that particular product, but without going through the hassle of setting up an account, or exposing their favorite `login with` provider for just another, simple, one-time buy event. They want a `flea market-like economic transaction`, not to engage in a 12 year relationship with a prenuptial agreement and a tough divorce.



### Contents

+ [Syntax](#syntax)
+ [Usage](#usage)
    + [Parser](#parser)
        + [Dolphin Example](#dolphin-example)
        + [World Example](#world-example)
        + [Advanced](#advanced)
    + [Clients](#clients)
        + [Gmail](#gmail)
+ [Packages](#packages)
+ [Codeophon](#codeophon)



## Syntax

An `action mail field content` is enclosed in `{` and `}`, or in `[` and `]`, or in other characters that have a general delimiting semantic, customizable and specified by the service implementing action mails. The `action mail field content` can consist of one or more `action mail field token`s.

An `action mail field token` can be an `action mail entity` or an `action mail variable`.

The `action mail entity` expresses the truth or falseness of a concept, e.g. `{send}`, `{generate}`. `action mail entities` can be negated by prefixing the token with common language words: `don't`, `no`, `none`; e.g. `{don't send}`. The negations can be extended and specified by the service implementing action mails.

The `action mail variables` expect a string value after the colon, e.g. `{name: one}`, `{zip code: 012345}`. The value is generally left to be filled by the user, but it can contain predefined values. The parsing of the string value into types, i.e. numbers, is left to the service implementing action mails, e.g. `{ one: 123 }` is parsed as `{ one: '123' }`.

An `action mail field` can have multiple `entities` and/or `variables`, using a `spacer` to distinguish them, e.g. `{send · name: one}`, `{generate, don't send}`, with `·` and `,` acting as `spacer`s. The `spacer`s are customizable and specified by the service implementing action mails.

The leading and trailing whitespace is trimmed from action mail field `entities` and `variables`, e.g.

```
{     pay  }
```

is parsed as `{ pay: true }` and

```
{   one:   two  }
```

is parsed as `{ one: 'two' }`.



## Usage

### Parser

In-browser `action mail`s are composed on the client-side using an anchor `a` tag with the `href` attribute set to `mailto`, where the query values of `subject` and `body` are `encodeURIComponent` strings with the `action mail` syntax interspersing the text.


#### Dolphin Example

Consider the following dummy example with a `jsx` `BuyWithoutAccount` button

``` tsx
const mail = 'address@example.com';

const requestSubject = encodeURIComponent(
    `Hello from subject text`,
);

const requestBody = encodeURIComponent(
    `Hello,\n\nfrom body text\n{using} an {action: mail} to {specify: variables} and {entities}.\n`,
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
{using} an {action: mail} to {specify: variables} and {entities}.
```

After the mail reaches the destination, it will be parsed and the following data structures is obtained

``` json
{
    "using": true,
    "action": "mail",
    "specify": "variables",
    "entities": true
}
```

The data structure can then be used to `POST` an API endpoint which will take care of responding accordingly to the `action mail`.

The [mail client add-ons](#clients) handle parsing and calling the adequate API endpoint, with the appropriate authorization token.


#### World Example

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
`);
```

which when parsed with the following settings

``` typescript
import {
    parser,
} from '@plurid/action-mail-parser';


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

The user only has to complete the `name`, `country`, `city`, `street` fields, or they could be autofilled with predefined values if they also use the `action mail` mail client.


#### Advanced

The `parser` options are

``` typescript
interface ParserOptions {
    /**
     * Delimiting string between multiple fields within the same action mail group.
     *
     * e.g. `{one: two · three: four}` with `·` as spacer.
     *
     * Default: none
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
     *
     * Default: `false`
     */
    camelCaseKeys: boolean;

    /**
     * Field start-end pairs.
     *
     * The first element marks field start, the second element marks field end.
     *
     * Default: `[ ['{', '}'] ]`
     */
    fielders: string[][];

    /**
     * Negation words (strings or regular expressions) to negate the value of a field.
     *
     * e.g. `{no foo}` gives `{ foo: false }`.
     *
     * Default: `[ 'no', 'not', 'none', 'don\'t', 'do not' ]`
     */
    negations: (string | RegExp)[];
}
```


When parsing multiple types of data, a `Registry` can be used to easily determine the data structure type.


``` typescript
import {
    Registry,
} from '@plurid/action-mail-parser';


const main = () => {
    const registry = new Registry();

    registry.register({
        type: 'one',
        shape: {
            two: 'string',
            three: 'boolean',
        },
    });


    interface DataOne {
        two: string;
        three: boolean;
    }

    const dataOne = `one {two: data one} {three}`;
    /**
     * {
     *   type: 'one',
     *   values: {
     *     two: 'data one',
     *     three: true,
     *   },
     * }
     */
    const parseOne = registry.parse<DataOne>(dataOne);
}

main();
```


### Clients

The `action mail` client listens for new mails, parses them accordingly, and sends the parsed data to the appropriate API `endpoint`.


### Gmail

The [Gmail Action Mail]((https://plurid.com/action-mail)) client is a Google Workspace Add-on which can be installed in Gmail.

To use the Action Mail, `Add Mail` providing the required information: `to mail`, `endpoint`, `token`, `public key`.


<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/action-mail/master/about/clients/presentation/action-mail-gmail-add.png" height="900px">
</p>


The `to mail` is the mail which receives action mails, if multiple mails configured in Gmail, e.g. `example@gmail.com`.


The `endpoint` is a `https` API endpoint, e.g. `https://api.example.com`. The endpoint can be `REST` or `GraphQL`.

The `GraphQL` types are

``` graphql
mutation ActionMailCall(input: ActionMailCallInput!): ActionMailResponse!


input ActionMailCallInput {
    data: ActionMailCallInputCrypted!
    metadata: ActionMailCallInputCrypted!
    token: String
}

input ActionMailCallInputCrypted {
    aes: String!
    text: String!
}


type ActionMailResponse {
    status: Boolean!
}
```


The `token` is generated and will be checked on the `endpoint`-side and can be attached to the `payload` or added as a `bearer` header, e.g. `Authorization: Bearer <token>`.

Due to a limitation in dynamically whitelisting URLs for the [URL Fetch Google Apps Script Service](https://developers.google.com/apps-script/manifest#Manifest.FIELDS.urlFetchWhitelist), the configured `endpoint` will be called from `https://api.plurid.com`.


The `public key` will be used to encrypt the `data` and `metadata` on the add-on side.

Generate private/public key pairs using

```
# generate private key
openssl genrsa -des3 -out action-mail.private.pem 4096

# extract public key
openssl rsa -in action-mail.private.pem -outform PEM -pubout -out action-mail.public.pem
```

The encryption scheme is hybrid:

+ the `data` and the `metadata` objects are converted to strings,
+ unique AES keys are generated to encrypt the values,
+ the generated AES keys are encrypted with the `public key` and sent together to the `endpoint`.

The call interface is

``` typescript
interface ActionMailCall {
    data: {
        aes: string;
        text: string;
    };
    metadata: {
        aes: string;
        text: string;
    };
    token: string;
}
```

The `metadata` interface is

``` typescript
interface ActionMailMetadata {
    id: string;
    parsedAt: number;
    message: ActionMailMetadataMessage;
}

interface ActionMailMetadataMessage {
    id: string;
    sender: string;
    receiver: string;
    subject: string
    body: string
    date: number;
    attachments: ActionMailMetadataAttachment[];
}

interface ActionMailMetadataAttachment {
    name: string;
    hash: string;
    size: number;
    contentType: string;
    bytes: number[];
}
```


A decryption implementation in NodeJS could look like this (see more in `fixtures/test-endpoint`).


``` typescript
import crypto from 'crypto';
import CryptoJS from 'crypto-js';


interface Crypted {
    text: string;
    aes: string;
}


const privateKey = `-----BEGIN RSA PRIVATE KEY-----...`;
const keyPassphrase = 'secretPassphrase';


const decryptAes = (
    aes: string,
    privateKey: string,
    keyPassphrase: string,
) => {
    const aesKey = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
            passphrase: keyPassphrase,
        },
        Buffer.from(aes, 'base64'),
    );

    return aesKey.toString();
}

const decryptLoad = (
    aesKey: string,
    load: string,
) => {
    const aesBytes = CryptoJS.AES.decrypt(load, aesKey.toString());
    const clearText = JSON.parse(aesBytes.toString(CryptoJS.enc.Utf8));

    return clearText;
}

const decrypt = (
    crypted: Crypted,
): any => {
    const {
        aes,
        text,
    } = crypted;

    const aesKey = decryptAes(
        aes,
        privateKey,
        keyPassphrase,
    );

    const load = decryptLoad(
        aesKey,
        text,
    );

    return load;
}
```


The `gateway token` is required to use extended features, such as increased bandwidth to account for attachments. See more on [plurid.com/action-mail](https://plurid.com/action-mail).


The `attachments`, if any, can be saved to the filesystem, given the correctly `JSON.parse`d `metadata` object.

``` typescript
import {
    promises as fs,
} from 'fs';

for (const attachment of metadata.message.attachments) {
    const {
        name,
        bytes,
    } = attachment;

    fs.writeFile(
        name,
        Buffer.from(bytes),
    );
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
