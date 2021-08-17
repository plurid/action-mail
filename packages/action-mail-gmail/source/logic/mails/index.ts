// #region imports
    import {
        Attachment,
        SentMailEvent,
        Metadata,
    } from '../../data/interfaces';

    import {
        PAGE_SIZE,
        PLURID_API_ENDPOINT,
    } from '../../data/constants';

    import {
        propertiesGet,
        propertiesAddEvent,
    } from '../../services/properties';

    import {
        uuid,
    } from '../../services/utilities';
// #endregion imports



// #region module
export function handleNewMails() {
    getUnreadMails();
}


export function getUnreadMails() {
    const ureadMsgsCount = GmailApp.getInboxUnreadCount();

    if (ureadMsgsCount > 0) {
        const threads = GmailApp.search('is:unread', 0, PAGE_SIZE);

        for (let i = 0; i < threads.length; i++) {
            const thread = threads[i];

            const messages = thread.getMessages()
            const message = messages[0];
            handleMessage(message);
        }
    }
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


export const generateAESKey = (
) => {
    return uuid() + uuid() + uuid() + uuid();
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

    const jsEncrypt = new JSEncrypt()
    jsEncrypt.setPublicKey(publicKey);
    const encryptedAES = jsEncrypt.encrypt(aesKey);

    return {
        text: encryptedText,
        aes: encryptedAES,
    };
}


export const sendMessage = (
    metadata: any,
    data: any,
    endpoint: string,
    endpointType: string,
    token: string,
    tokenType: string,
    publicKey: string,
) => {
    const actionMail = {
        metadata: encrypt(metadata, publicKey),
        data: encrypt(data, publicKey),
    };
    if (tokenType === 'payload') {
        actionMail['token'] = token;
    }


    let headers = {};
    if (tokenType === 'bearer') {
        headers['Authorization'] = `Bearer ${token}`;
    }


    let payload;
    switch (endpointType) {
        case 'graphql':
            payload = notifyActionMailGraphql(
                actionMail,
            );
            break;
        case 'rest':
            payload = notifyActionMailRest(
                actionMail,
            );
    }
    if (!payload) {
        return;
    }


    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload),
        headers,
    };

    const post = UrlFetchApp.fetch(endpoint, options);
    const responseCode = post.getResponseCode();

    let success = true;
    if (responseCode !== 200) {
        success = false;
    }


    const sentMail: SentMailEvent = {
        success,
        data,
        metadata,
        id: metadata.id,
        parsedAt: metadata.parsedAt,
        sentAt: Date.now(),
        sender: metadata.message.sender,
        receiver: metadata.message.receiver,
    };
    propertiesAddEvent(sentMail);
}


export function handleMessage(
    message: GoogleAppsScript.Gmail.GmailMessage,
) {
    const to = getMailFromAddress(message.getTo());
    if (!to) {
        return;
    }

    const config = propertiesGet(`config-${to}`);
    if (!config) {
        return;
    }

    const {
        endpoint,
        endpointType,
        token,
        tokenType,
        publicKey,
        useAttachments,
        parseSubject,
        spacer,
        camelCaseKeys,
        fielders,
    } = config;


    const id = uuid();
    const parsedAt = Date.now();

    const messageID = message.getId();
    const sender = message.getFrom();
    const subject = message.getSubject();
    const body = message.getPlainBody();
    const date = message.getDate();
    const messageAttachments = message.getAttachments();
    const attachments: Attachment[] = [];

    if (useAttachments) {
        for (const messageAttachment of messageAttachments) {
            const name = messageAttachment.getName();
            const size = messageAttachment.getSize();
            const blob = messageAttachment.copyBlob();

            const attachment: Attachment = {
                name,
                size,
                blob,
            };
            attachments.push(attachment);
        }
    }

    const parserData = parseSubject
        ? subject + ' ' + body
        : body;

    const data = parser(
        parserData,
        {
            spacer,
            camelCaseKeys,
            fielders: getFielders(fielders),
        },
    );

    const metadata: Metadata = {
        id,
        parsedAt,
        message: {
            id: messageID,
            sender,
            receiver: to,
            subject,
            body,
            date,
            attachments,
        },
    };


    sendMessage(
        metadata,
        data,
        endpoint,
        endpointType,
        token,
        tokenType,
        publicKey,
    );


    message.markRead();
}


export function notifyActionMailGraphql(
    actionMail: any,
) {
    const payload = {
        query: `
            mutation ActionMailCall($input: ActionMailCallInput!) {
                actionMailCall(input: $input) {
                    status
                }
            }
        `,
        variables: {
            input: {
                ...actionMail,
            },
        },
    };

    return payload;
}


export function notifyActionMailRest(
    actionMail: any,
) {
    return actionMail;
}
// #endregion module
