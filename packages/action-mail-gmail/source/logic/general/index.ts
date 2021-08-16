// #region imports
    // #region external
    import {
        propertiesGet,
        propertiesReset,
        propertiesDelete,
    } from '~services/properties';

    import MailDataCard from '~components/MailDataCard';
    import EventsCard from '~components/EventsCard';
    // #endregion external
// #endregion imports



// #region module
export function viewConfig (
    data: any,
) {
    const id = data.parameters.id;

    const configData = propertiesGet(id);
    if (!configData) {
        return;
    }

    const card = MailDataCard(configData);
    return [card];
}


export function viewEvents(
    data: any,
) {
    const id = data.parameters.id;

    const eventsCard = EventsCard(id);

    return [eventsCard];
}


export function deleteMail(
    data: any,
) {
    const id = data.parameters.id;
    propertiesDelete(id);
}


export function reset() {
    propertiesReset();
}
// #endregion module
