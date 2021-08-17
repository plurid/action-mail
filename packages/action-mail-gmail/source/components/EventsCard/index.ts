// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
        RESET_ICON_URL,
        OBLITERATE_ICON_URL,

        PROPERTIES_SETTINGS,

        DEFAULT_TIME_LOCALE,
    } from '~data/constants';

    import {
        propertiesGet,
        propertiesGetEvents,
    } from '~services/properties';
    // #endregion external
// #endregion imports



// #region module
export const getEvents = (
    toMail: string,
) => {
    const settings = propertiesGet(PROPERTIES_SETTINGS);

    const events: GoogleAppsScript.Card_Service.CardSection[] = [];

    const eventsData = propertiesGetEvents(toMail);
    if (eventsData.length === 0) {
        return [];
    }

    const sortedEventsData = eventsData.sort((a, b) => {
        if (a.sentAt > b.sentAt) return -1;
        if (b.sentAt > a.sentAt) return 1;

        return 0;
    });

    for (const eventData of sortedEventsData) {
        const {
            id,
            success,
            data,
            sentAt,
            sender,
        } = eventData;


        const successText = success
            ? '[sent]'
            : '[error';

        const cleanSender = sender
            .replace('<', '&lt;')
            .replace('>', '&gt;');

        const dateValue = new Date(sentAt).toLocaleString(settings?.timeLocale || DEFAULT_TIME_LOCALE);

        const text = CardService.newTextParagraph()
            .setText(`${successText} from ${cleanSender} on ${dateValue}`);


        const dataValue = Object.keys(data).length === 0
            ? 'no actions'
            : JSON.stringify(data, null, 2);
        const dataText = CardService.newTextParagraph()
            .setText(dataValue);


        const resendAction = CardService.newAction()
            .setFunctionName('resendEvent')
            .setParameters({
                id,
                mail: toMail,
            });
        const resendButton = CardService.newDecoratedText()
            .setText('Resend Event')
            .setIconUrl(RESET_ICON_URL)
            .setOnClickAction(resendAction);


        const forgetAction = CardService.newAction()
            .setFunctionName('forgetEvent')
            .setParameters({
                id,
                mail: toMail,
            });
        const forgetButton = CardService.newDecoratedText()
            .setText('Forget Event')
            .setIconUrl(OBLITERATE_ICON_URL)
            .setOnClickAction(forgetAction);

        const section = CardService.newCardSection()
            .addWidget(text)
            .addWidget(dataText)
            .addWidget(resendButton)
            .addWidget(forgetButton);

        events.push(section);
    }

    return events;
}


export const NoEventsCard = () => {
    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);

    const header = CardService.newTextParagraph()
            .setText(`<b>No Events</b>`);

    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(header)

    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}


const EventsCard = (
    id: string,
) => {
    const noEventsCard = NoEventsCard();


    const configData = propertiesGet(id);
    if (!configData) {
        return noEventsCard;
    }


    const {
        toMail,
    } = configData;

    const events = getEvents(toMail);
    if (events.length === 0) {
        return noEventsCard;
    }


    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);


    const header = CardService.newTextParagraph()
        .setText(`<b>Events for ${toMail}</b>`);


    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(header);


    const card = CardService.newCardBuilder()
        .addSection(section);


    for (const event of events) {
        card.addSection(event);
    }


    return card
        .build();
}
// #endregion module



// #region exports
export default EventsCard;
// #endregion exports
