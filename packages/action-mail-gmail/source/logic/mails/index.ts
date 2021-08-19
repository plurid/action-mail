// #region imports
    // #region external
    import {
        MailConfiguration,
    } from '~data/interfaces';

    import {
        PAGE_SIZE,
    } from '~data/constants';

    import {
        propertiesGet,
    } from '~services/properties';

    import {
        getMailFromAddress,
        getFielders,
    } from '~logic/general';

    import {
        generateMetadata,
    } from '~logic/messageMetadata';

    import {
        sendMessage,
    } from '~logic/sendMessage';
    // #endregion external
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
            try {
                const thread = threads[i];

                const messages = thread.getMessages()
                const message = messages[0];
                handleMessage(message);
            } catch (error) {
                continue;
            }
        }
    }
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
        gatewayToken,
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
        gatewayToken,
    );


    message.markRead();
}
// #endregion module
