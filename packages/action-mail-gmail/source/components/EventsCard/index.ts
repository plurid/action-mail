// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
    } from '~data/constants';

    import {
        propertiesGet,
    } from '~services/properties';
    // #endregion external
// #endregion imports



// #region module
const getEvents = (
    toMail: string,
) => {
    const events: any[] = [];

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


    const events = getEvents(toMail);
    for (const event of events) {
        section.addWidget(event);
    }


    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module



// #region exports
export default EventsCard;
// #endregion exports
