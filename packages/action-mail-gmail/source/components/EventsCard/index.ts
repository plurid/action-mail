// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
    } from '~data/constants';

    import {
        propertiesGet,
        propertiesGetEvents,
    } from '~services/properties';
    // #endregion external
// #endregion imports



// #region module
const getEvents = (
    toMail: string,
) => {
    const events: GoogleAppsScript.Card_Service.CardSection[] = [];

    const eventsData = propertiesGetEvents(toMail);
    if (eventsData.length === 0) {
        return [];
    }

    for (const eventData of eventsData) {
        const {
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

        const section = CardService.newCardSection()
            .addWidget(text)
            .addWidget(dataText);

        events.push(section);
    }

    return events;
}


const EventsCard = (
    id: string,
) => {
    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);


    const configData = propertiesGet(id);
    if (!configData) {
        const header = CardService.newTextParagraph()
            .setText(`<b>No Events</b>`);

        const section = CardService.newCardSection()
            .addWidget(banner)
            .addWidget(header)

        return CardService.newCardBuilder()
            .addSection(section)
            .build();
    }


    const {
        toMail,
    } = configData;


    const header = CardService.newTextParagraph()
        .setText(`<b>Events for ${toMail}</b>`);


    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(header);


    const card = CardService.newCardBuilder()
        .addSection(section);


    const events = getEvents(toMail);
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
