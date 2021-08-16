// #region imports
    // #region external
    import {
        propertiesRemoveEvent,
    } from '~services/properties';
    // #endregion external
// #endregion imports



// #region module
export function resendEvent(
    data: any,
) {
    const id = data.parameters.id;
}


export function forgetEvent(
    data: any,
) {
    const {
        id,
        mail,
    } = data.parameters;

    propertiesRemoveEvent(
        id,
        mail,
    );
}
// #endregion module
