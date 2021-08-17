// #region imports
    import {
        Attachment,
    } from '../../data/interfaces';

    import {
        PAGE_SIZE,
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


export const sendMessage = (
    metadata: any,
    data: any,
    endpoint: any,
    endpointType: any,
    token: any,
    tokenType: any,
) => {
    const actionMail = {
        metadata,
        data,
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


    const sentMail = {
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
        spacer,
        camelCaseKeys,
        token,
        tokenType,
        useAttachments,
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

    const data = parser(
        body,
        {
            spacer,
            camelCaseKeys,
        },
    );

    const metadata = {
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
