// #region imports
    // #region external
    import EventsCard from '~components/EventsCard';

    import {
        propertiesRemoveEvent,
        propertiesGet,
        propertiesGetEvent,
        propertiesGetEvents,
    } from '~services/properties';

    import {
        generateMetadata,
    } from '~logic/messageMetadata';

    import {
        sendMessage,
    } from '~logic/sendMessage';
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
        messageID,
        data,
    } = event;

    const message = GmailApp.getMessageById(messageID);
    if (!message) {
        return;
    }


    const {
        endpoint,
        endpointType,
        token,
        tokenType,
        publicKey,
    } = config;

    const metadata = generateMetadata(
        config,
        message,
    );


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


export function forgetEvents(
    call: any,
) {
    const {
        mail,
    } = call.parameters;

    const eventsData = propertiesGetEvents(mail);

    for (const eventData of eventsData) {
        propertiesRemoveEvent(
            eventData.id,
            mail,
        );
    }

    return refreshEventCard(mail);
}
// #endregion module
