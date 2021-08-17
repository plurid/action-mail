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
    } = config;

    sendMessage(
        metadata,
        data,
        endpoint,
        endpointType,
        token,
        tokenType,
    );
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

    const eventsCard = EventsCard(`config-${mail}`);

    return CardService.newNavigation().updateCard(eventsCard);
}
// #endregion module
