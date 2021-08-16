// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
        RESET_ICON_URL,
        OBLITERATE_ICON_URL,
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
    const events: GoogleAppsScript.Card_Service.CardSection[] = [];

    const eventsData = propertiesGetEvents(toMail);
    if (eventsData.length === 0) {
        return [];
    }

    for (const eventData of eventsData) {
        const {
            id,
            success,
            data,
            parsedAt,
            sender,
        } = eventData;


        const successText = success
            ? '[sent]'
            : '[error';

        const text = CardService.newTextParagraph()
            .setText(`${successText} from ${sender} on ${new Date(parsedAt).toLocaleString()}`);


        const dataText = CardService.newTextParagraph()
            .setText(JSON.stringify(data, null, 2));


        const resendAction = CardService.newAction()
            .setFunctionName('resendEvent')
            .setParameters({
                id,
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
