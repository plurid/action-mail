// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
    } from '~data/constants';
    // #endregion external
// #endregion imports



// #region module
const EventsCard = (
    id: string,
) => {
    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);


    const section = CardService.newCardSection()
        .addWidget(banner)


    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module



// #region exports
export default EventsCard;
// #endregion exports
