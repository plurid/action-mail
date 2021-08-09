// #region module
const TRIGGER_NAME = 'handleNewMails';

// Maximum number of threads to process per run.
const PAGE_SIZE = 150;

const INTERVAL = 2; // minutes


function InstallGmail() {
    UninstallGmail();

    // First run 2 mins after install
    ScriptApp.newTrigger(TRIGGER_NAME)
        .timeBased()
        .at(new Date(new Date().getTime() + 1000 * 60 * INTERVAL))
        .create();

    // Run every 2 minute there after
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
// #endregion module
