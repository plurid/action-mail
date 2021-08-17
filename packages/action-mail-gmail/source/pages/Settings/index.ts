// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
    } from '~data/constants';
    // #endregion external
// #endregion imports



// #region module
export function handleSettingsPage() {
    const card = buildSettingsCard();

    return [card];
}


export const buildSettingsCard = () => {
    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);

    const header = CardService.newTextParagraph()
        .setText(`<b>Settings</b>`);


    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(header);


    const card = CardService.newCardBuilder()
        .addSection(section);


    return card.build();
}
// #endregion module
