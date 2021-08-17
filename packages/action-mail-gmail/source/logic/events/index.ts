// #region imports
    // #region external
    import EventsCard from '~components/EventsCard';

    import {
        propertiesRemoveEvent,
        propertiesGet,
        propertiesGetEvent,
    } from '~services/properties';

    import {
        sendMessage,
    } from '../mails';
    // #endregion external
// #endregion imports



// #region module
export const refreshEventCard = (
    mail: string,
) => {
    const eventsCard = EventsCard(`config-${mail}`);

    return CardService.newNavigation().updateCard(eventsCard);
}


export function resendEvent(
    call: any,
) {
    const {
        id,
        mail,
    } = call.parameters;

    const config = propertiesGet(`config-${mail}`);
    if (!config) {
        return;
    }

    const event = propertiesGetEvent(mail, id);
    if (!event) {
        return;
    }

    const {
        metadata,
        data,
    } = event;

    const {
        endpoint,
        endpointType,
        token,
        tokenType,
        publicKey,
    } = config;

    sendMessage(
        metadata,
        data,
        endpoint,
        endpointType,
        token,
        tokenType,
        publicKey,
    );

    return refreshEventCard(mail);
}


export function forgetEvent(
    call: any,
) {
    const {
        id,
        mail,
    } = call.parameters;

    propertiesRemoveEvent(
        id,
        mail,
    );

    return refreshEventCard(mail);
}
// #endregion module
