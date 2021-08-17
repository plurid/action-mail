// #region imports
    // #region external
    import {
        PROPERTIES_ADD_CONFIG,
        PROPERTIES_ALL_CONFIGS,
    } from '~data/constants';
    // #endregion external
// #endregion imports



// #region module
export const propertiesGet = (
    key: string,
    json: boolean = true,
) => {
    try {
        const propertiesService = PropertiesService.getUserProperties();
        const value = propertiesService.getProperty(key);
        if (!value) {
            return;
        }

        if (!json) {
            return value;
        }

        return JSON.parse(value);
    } catch (error) {
        return;
    }
}


export const propertiesSet = (
    key: string,
    value: any,
    json: boolean = true,
) => {
    const propertiesService = PropertiesService.getUserProperties();
    const propertiesValue = json ? JSON.stringify(value) : value;
    propertiesService.setProperty(key, propertiesValue);
}


export const propertiesDelete = (
    key: string,
) => {
    const propertiesService = PropertiesService.getUserProperties();
    propertiesService.deleteProperty(key);
}


export const propertiesReset = () => {
    const propertiesService = PropertiesService.getUserProperties();
    propertiesService.deleteAllProperties();
}


export const propertiesUpdateAllConfigs = (
    config: string,
) => {
    let allConfigs = propertiesGet(PROPERTIES_ALL_CONFIGS);
    if (!allConfigs) {
        propertiesSet(
            PROPERTIES_ALL_CONFIGS,
            [
                config,
            ],
        );
        return;
    }

    const allConfigsUnique = new Set<string>([
        ...allConfigs,
        config,
    ]);

    propertiesSet(
        PROPERTIES_ALL_CONFIGS,
        [
            ...allConfigsUnique,
        ],
    );

    propertiesDelete(
        PROPERTIES_ADD_CONFIG,
    );
}


export const propertiesAddEvent = (
    event: any,
) => {
    const {
        id,
        receiver,
    } = event;

    const receiverEventsKey = `events-${receiver}`;
    const receiverEvents = propertiesGet(receiverEventsKey);

    const eventID = `event-${receiver}-${id}`;


    if (!receiverEvents) {
        propertiesSet(receiverEventsKey, [
            eventID,
        ]);
    } else {
        propertiesSet(receiverEventsKey, [
            ...receiverEvents,
            eventID,
        ]);
    }

    propertiesSet(eventID, event);
}


export const propertiesRemoveEvent = (
    id: string,
    mail: string,
) => {
    const mailEventsKey = `events-${mail}`;
    const mailEvents = propertiesGet(mailEventsKey);

    const eventID = `event-${mail}-${id}`;

    if (!mailEvents) {
        propertiesSet(mailEventsKey, []);
    } else {
        const filteredMailEvents = mailEvents.filter(
            (mailEvent: any) => mailEvent !== eventID,
        );

        propertiesSet(mailEventsKey, [
            ...filteredMailEvents,
        ]);
    }

    propertiesDelete(eventID);
}


export const propertiesGetEvent = (
    mail: string,
    id: string,
) => {
    const eventID = `event-${mail}-${id}`;
    const event = propertiesGet(eventID);
    return event;
}


export const propertiesGetEvents = (
    mail: string,
) => {
    const events: any[] = [];

    const eventsKey = `events-${mail}`;
    const eventIDs = propertiesGet(eventsKey);

    if (!eventIDs) {
        return events;
    }

    for (const eventID of eventIDs) {
        const event = propertiesGet(eventID);
        events.push(event);
    }

    return events;
}
// #endregion module
