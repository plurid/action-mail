// #region imports
    // #region external
    import {
        propertiesGet,
        propertiesReset,
        propertiesDelete,
    } from '~services/properties';

    import MailDataCard from '~components/MailDataCard';
    import EventsCard from '~components/EventsCard';

    import {
        uuid,
    } from '~services/utilities';
    // #endregion external
// #endregion imports



// #region module
export function viewConfig (
    data: any,
) {
    const id = data.parameters.id;

    const configData = propertiesGet(id);
    if (!configData) {
        return;
    }

    const card = MailDataCard(configData);
    return [card];
}


export function viewEvents(
    data: any,
) {
    const id = data.parameters.id;

    const eventsCard = EventsCard(id);

    return [eventsCard];
}


export function deleteMail(
    data: any,
) {
    const id = data.parameters.id;
    propertiesDelete(id);
}


export function reset() {
    propertiesReset();
}



export const getFielders = (
    fielders?: string,
) => {
    const defaultFielders = [
        ['{', '}']
    ];

    if (!fielders) {
        return defaultFielders;
    }


    const fieldersValue: string[][] = [];

    const lines = fielders.split('\n');

    for (const line of lines) {
        const items = line.split(' ');
        const start = items[0];
        const end = items[1];

        fieldersValue.push([
            start, end,
        ]);
    }

    if (fieldersValue.length === 0) {
        return defaultFielders;
    }

    return fieldersValue;
}


export const generateAESKey = () => {
    return uuid();
}


/**
 * Generates and AES key and encrypts the value as text with the AES key (arbitrary length encryption).
 *
 * Encrypts the AES key with the user's public key.
 *
 * The user will decrypt the `aes` key using their private key,
 * then will decrypt the `text` wih the key obtained.
 *
 * @param value
 * @param publicKey
 * @returns
 */
export const encrypt = (
    value: any,
    publicKey: string,
) => {
    const text = JSON.stringify(value);

    const aesKey = generateAESKey();
    const cipher = new cCryptoGS.Cipher(aesKey, 'aes');
    const encryptedText = cipher.encrypt(text);

    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(publicKey);
    const encryptedAES = jsEncrypt.encrypt(aesKey);

    return {
        text: encryptedText,
        aes: encryptedAES,
    };
}


export const getMailFromAddress = (
    address: string,
) => {
    if (!address.includes(' ')) {
        return address;
    }

    const re = /\<(.*)\>/;
    const match = address.match(re);
    if (!match) {
        return;
    }

    return match[1];
}
// #endregion module
