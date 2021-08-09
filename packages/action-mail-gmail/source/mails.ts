// #region imports
    import {
        cacheGet,
    } from './cache';

    import {
        uuid,
    } from './utilities';
// #endregion imports



// #region module
export function handleNewMails() {
    getUnreadMails();
}


export function getUnreadMails() {
    const ureadMsgsCount = GmailApp.getInboxUnreadCount();

    if (ureadMsgsCount > 0) {
        const threads = GmailApp.getInboxThreads(0, ureadMsgsCount);

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
    const re = /\<(.*)\>/;
    const match = address.match(re);
    if (!match) {
        return;
    }

    return match[1];
}


export function handleMessage(
    message: GoogleAppsScript.Gmail.GmailMessage,
) {
    const to = getMailFromAddress(message.getTo());
    if (!to) {
        return;
    }

    const config = cacheGet(`config-${to}`);
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
    } = config;


    const id = uuid();
    const parsedAt = Date.now();

    const messageID = message.getId();
    const sender = message.getFrom();
    const subject = message.getSubject();
    const body = message.getPlainBody();
    const date = message.getDate();

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
            subject,
            body,
            date,
        },
    };

    switch (endpointType) {
        case 'graphql':
            notifyActionMailGraphql(
                metadata,
                data,
                endpoint,
                token,
                tokenType,
            );
            break;
        case 'rest':
            notifyActionMailRest(
                metadata,
                data,
                endpoint,
                token,
                tokenType,
            );
    }

    message.markRead();
}


export function notifyActionMailGraphql(
    metadata: any,
    data: any,
    endpoint: string,
    token: string,
    tokenType: 'payload' | 'bearer',
) {

}


export function notifyActionMailRest(
    metadata: any,
    data: any,
    endpoint: string,
    token: string,
    tokenType: 'payload' | 'bearer',
) {
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


    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(actionMail),
        headers,
    };

    const post = UrlFetchApp.fetch(endpoint, options);
    const responseCode = post.getResponseCode();

    if (responseCode !== 200) {

    }
}
// #endregion module
