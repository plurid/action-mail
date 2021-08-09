// #region module
function handleSettingsPage() {
    const card = buildSettingsCard();

    return [card];
}


const buildSettingsCard = () => {
    const banner = CardService.newImage()
        .setImageUrl('https://raw.githubusercontent.com/plurid/action-mail/master/about/identity/action-mail-banner.png');

    const section = CardService.newCardSection()
        .addWidget(banner);

    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module
