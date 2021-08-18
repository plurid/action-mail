// #region imports
    import {
        Attachment,
        MailConfiguration,
        SentMailEvent,
        Metadata,
    } from '../../data/interfaces';

    import {
        PAGE_SIZE,
        API_ENDPOINT,
        API_TYPE,
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


export const sendMessage = (
    metadata: Metadata,
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
        endpoint,
        endpointType,
    };
    if (tokenType === 'payload') {
        actionMail['token'] = token;
    }


    let headers = {};
    if (tokenType === 'bearer') {
        headers['Authorization'] = `Bearer ${token}`;
    }


    let payload;
    switch (API_TYPE) {
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

    const post = UrlFetchApp.fetch(API_ENDPOINT, options);
    const responseCode = post.getResponseCode();

    let success = true;
    if (responseCode !== 200) {
        success = false;
    }


    const sentMail: SentMailEvent = {
        success,
        data,
        id: metadata.id,
        messageID: metadata.message.id,
        parsedAt: metadata.parsedAt,
        sentAt: Date.now(),
        sender: metadata.message.sender,
        receiver: metadata.message.receiver,
    };
    propertiesAddEvent(sentMail);
}


export const getAttachments = (
    config: MailConfiguration,
    message: GoogleAppsScript.Gmail.GmailMessage,
) => {
    const attachments: Attachment[] = [];

    const messageAttachments = message.getAttachments();

    if (config.useAttachments) {
        for (const messageAttachment of messageAttachments) {
            const name = messageAttachment.getName();
            const hash = messageAttachment.getHash();
            const size = messageAttachment.getSize();
            const contentType = messageAttachment.getContentType();
            const bytes = messageAttachment.getBytes();

            const attachment: Attachment = {
                name,
                hash,
                size,
                contentType,
                bytes,
            };
            attachments.push(attachment);
        }
    }

    return attachments;
}


export const generateMetadata = (
    config: MailConfiguration,
    message: GoogleAppsScript.Gmail.GmailMessage,
) => {
    const to = getMailFromAddress(message.getTo()) || '';

    const id = uuid();
    const parsedAt = Date.now();

    const messageID = message.getId();
    const subject = message.getSubject();
    const body = message.getPlainBody();
    const sender = message.getFrom();
    const date = message.getDate();

    const attachments = getAttachments(
        config,
        message,
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

    return metadata;
}


export function handleMessage(
    message: GoogleAppsScript.Gmail.GmailMessage,
) {
    const to = getMailFromAddress(message.getTo());
    if (!to) {
        return;
    }

    const config: MailConfiguration | undefined = propertiesGet(`config-${to}`);
    if (!config) {
        return;
    }

    const {
        endpoint,
        endpointType,
        token,
        tokenType,
        publicKey,
        parseSubject,
        spacer,
        camelCaseKeys,
        fielders,
    } = config;


    const subject = message.getSubject();
    const body = message.getPlainBody();

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

    const metadata = generateMetadata(
        config,
        message,
    );

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
