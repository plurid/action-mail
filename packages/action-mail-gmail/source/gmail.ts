// #region module
const TRIGGER_NAME = 'handleNewEmails';

// Maximum number of threads to process per run.
const PAGE_SIZE = 150;

const INTERVAL = 1;


function InstallGmail() {
    UninstallGmail();

    // First run 2 mins after install
    ScriptApp.newTrigger(TRIGGER_NAME)
        .timeBased()
        .at(new Date(new Date().getTime() + 1000 * 60 * 2))
        .create();

    // Run every 1 minute there after
    ScriptApp.newTrigger(TRIGGER_NAME)
        .timeBased().everyMinutes(INTERVAL).create();
}


function UninstallGmail() {
    const triggers = ScriptApp.getProjectTriggers();

    for (let i = 0; i < triggers.length; i++) {
        if (triggers[i].getHandlerFunction() === TRIGGER_NAME) {
            ScriptApp.deleteTrigger(triggers[i]);
        }
    }
}

function handleNewEmails() {
    getUnreadMails();
}


function getUnreadMails() {
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


const getMailFromAddress = (
    address: string,
) => {
    const re = /\<(.*)\>/;
    const match = address.match(re);
    if (!match) {
        return;
    }

    return match[1];
}


const cacheGet = (
    key: string,
    json: boolean = true,
) => {
    try {
        const cache = CacheService.getUserCache();
        const value = cache.get(key);
        if (!value) {
            return;
        }

        if (!json) {
            return value;
        }

        return JSON.parse(value);
    } catch (error) {
        return;
    }
}

const cacheSet = (
    key: string,
    value: any,
    json: boolean = true,
) => {
    const cache = CacheService.getUserCache();
    const cacheValue = json ? JSON.stringify(value) : value;
    cache.put(key, cacheValue);
}


function handleMessage(
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


function notifyActionMailGraphql(
    metadata: any,
    data: any,
    endpoint: string,
    token: string,
    tokenType: 'payload' | 'bearer',
) {

}


function notifyActionMailRest(
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