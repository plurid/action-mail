// #region imports
    // #region external
    import {
        SentMailEvent,
        Metadata,
        ActionMailCall,
    } from '~data/interfaces';

    import {
        API_ENDPOINT,
        API_TYPE,
    } from '~data/constants';

    import {
        propertiesAddEvent,
    } from '~services/properties';

    import {
        encrypt,
    } from '~logic/general';
    // #endregion external
// #endregion imports



// #region module
export const parseResponse = (
    text: string,
) => {
    try {
        const response = JSON.parse(text);

        return {
            ...response,
        };
    } catch (error) {
        return {
            error: 'unparseable',
        };
    }
}


export const sendMessage = (
    metadata: Metadata,
    data: any,
    endpoint: string,
    endpointType: string,
    token: string,
    tokenType: string,
    publicKey: string,
    gatewayToken: string | undefined,
) => {
    const actionMail: ActionMailCall = {
        metadata: encrypt(metadata, publicKey),
        data: encrypt(data, publicKey),
        endpoint,
        endpointType,
        token,
        tokenType,
        gatewayToken,
    };


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

    const sentMail: SentMailEvent = {
        success: false,
        data,
        id: metadata.id,
        messageID: metadata.message.id,
        parsedAt: metadata.parsedAt,
        sentAt: Date.now(),
        sender: metadata.message.sender,
        receiver: metadata.message.receiver,
    };

    try {
        const post = UrlFetchApp.fetch(API_ENDPOINT, options);
        const responseCode = post.getResponseCode();

        const text = post.getContentText();
        const response = parseResponse(text);

        if (responseCode === 200 && response.status) {
            sentMail.success = true;
        }

        if (response.error) {
            sentMail.error = response.error;
        }

        propertiesAddEvent(sentMail);
    } catch (error) {
        sentMail.success = false;
        sentMail.error = 'unreachable';
        propertiesAddEvent(sentMail);
    }
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
