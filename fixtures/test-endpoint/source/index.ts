// #region imports
    // #region libraries
    import {
        promises as fs,
    } from 'fs';

    import express from 'express';
    import {
        json as jsonParser,
    } from 'body-parser';

    import CryptoJS from 'crypto-js';
    import crypto from 'crypto';
    // #endregion libraries


    // #region internal
    import {
        privateKey,
        keyPassphrase,
    } from './keys';
    // #endregion internal
// #endregion imports



// #region module
const PORT = 44555;

export interface Crypted {
    text: string;
    aes: string;
}


const decryptAes = (
    aes: string,
    privateKey: string,
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
    );

    const load = decryptLoad(
        aesKey,
        text,
    );

    return load;
}


const saveAttachments = async (
    metadata: any,
) => {
    if (metadata.message.attachments.length > 0) {
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
    }
}


const handleRequest = async (
    metadata: Crypted,
    data: Crypted,
) => {
    const clearMetadata = decrypt(metadata);
    console.log('clearMetadata', clearMetadata);

    const clearData = decrypt(data);
    console.log('clearData', clearData);


    saveAttachments(clearMetadata);
}



const main = async () => {
    const server = express();

    server.use(jsonParser({
        limit: '25mb',
    }));


    server.post('/rest', async (request, response) => {
        response.end();

        console.log('rest endpoint hit', request.body);

        const {
            metadata,
            data,
        } = request.body;

        await handleRequest(
            metadata,
            data,
        );
    });

    server.post('/graphql', async (request, response) => {
        response.end();

        console.log('graphql endpoint hit', request.body);

        const {
            metadata,
            data,
        } = request.body.variables.input;

        await handleRequest(
            metadata,
            data,
        );
    });


    server.listen(PORT, () => {
        console.log(`action mail test endpoint started on port ${PORT}`);
    });
}


main();
// #endregion module
