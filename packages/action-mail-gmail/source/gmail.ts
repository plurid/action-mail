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


function handleMessage(
    message: GoogleAppsScript.Gmail.GmailMessage,
) {
    const endpoint = '';
    const spacer = '·'
    const camelCaseKeys = true;


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

    notifyActionMail(
        metadata,
        data,
        endpoint,
    );

    message.markRead();
}


function notifyActionMail (
    metadata: any,
    data: any,
    endpoint: string,
) {
    const actionMail = {
        metadata,
        data,
    };

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(actionMail),
    };

    const post = UrlFetchApp.fetch(endpoint, options);
    const responseCode = post.getResponseCode();

    if (responseCode !== 200) {

    }
}
// #endregion module
