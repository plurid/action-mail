// #region module
function handleHomePage() {
    console.log('handleHomePage');
}


function handleShowSettings() {
    console.log('handleShowSettings');
}





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
    message,
) {
    const sender = message.getFrom();
    const subject = message.getSubject();
    const body = message.getPlainBody();

    const parsed = parser(
        body,
        {
            spacer: '·',
            camelCaseKeys: true,
        },
    );

    const endpoint = '';
    notifyActionMail(
        parsed,
        endpoint,
    );
}


function notifyActionMail (
    data,
    endpoint,
) {
    const options = {
        'method' : 'post',
        'contentType': 'application/json',
        'payload' : JSON.stringify(data),
    };

    const post = UrlFetchApp.fetch(endpoint, options);
    const responseCode = post.getResponseCode();

    if (responseCode !== 200) {

    }
}
// #endregion module
