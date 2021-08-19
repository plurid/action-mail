// #region imports
    // #region external
    import {
        INSTALL_TRIGGER_NAME,
        INSTALL_INTERVAL,
    } from '~data/constants';
    // #endregion external
// #endregion imports



// #region module
export function InstallGmail() {
    UninstallGmail();

    // First run 1 minute after install.
    ScriptApp.newTrigger(INSTALL_TRIGGER_NAME)
        .timeBased()
        .at(new Date(new Date().getTime() + 1000 * 60 * INSTALL_INTERVAL))
        .create();

    // Run every 1 minute there after.
    ScriptApp.newTrigger(INSTALL_TRIGGER_NAME)
        .timeBased().everyMinutes(INSTALL_INTERVAL).create();
}


export function UninstallGmail() {
    const triggers = ScriptApp.getProjectTriggers();

    for (let i = 0; i < triggers.length; i++) {
        if (triggers[i].getHandlerFunction() === INSTALL_TRIGGER_NAME) {
            ScriptApp.deleteTrigger(triggers[i]);
        }
    }
}
// #endregion module
