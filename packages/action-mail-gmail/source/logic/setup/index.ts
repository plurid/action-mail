// #region module
export const TRIGGER_NAME = 'handleNewMails';


export const INTERVAL = 1; // minutes


export function InstallGmail() {
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


export function UninstallGmail() {
    const triggers = ScriptApp.getProjectTriggers();

    for (let i = 0; i < triggers.length; i++) {
        if (triggers[i].getHandlerFunction() === TRIGGER_NAME) {
            ScriptApp.deleteTrigger(triggers[i]);
        }
    }
}
// #endregion module
