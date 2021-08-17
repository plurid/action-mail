// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
        ADD_ICON_URL,
        EVENTS_ICON_URL,
        OBLITERATE_ICON_URL,

        PROPERTIES_ALL_CONFIGS,
    } from '~data/constants';

    import {
        propertiesGet,
    } from '~services/properties';
    // #endregion external
// #endregion imports



// #region module
export function handleHomePage() {
    const card = buildHomeCard();

    return [card];
}


export const getMails = () => {
    let allConfigs = propertiesGet(PROPERTIES_ALL_CONFIGS);

    const mails: GoogleAppsScript.Card_Service.CardSection[] = [];

    if (allConfigs) {
        for (const config of allConfigs) {
            const configData = propertiesGet(config);
            if (!configData) {
                continue;
            }

            if (
                !configData.toMail
                || !configData.endpoint
            ) {
                return;
            }


            const eventsAction = CardService
                .newAction()
                .setFunctionName('viewEvents')
                .setParameters({
                    id: config,
                });


            const configAction = CardService
                .newAction()
                .setFunctionName('viewConfig')
                .setParameters({
                    id: config,
                });
            const configButton = CardService.newImageButton()
                .setIconUrl(EVENTS_ICON_URL)
                .setOnClickAction(configAction);


            const decoratedTextButton = CardService.newDecoratedText()
                .setText(configData.toMail)
                .setButton(configButton)
                .setOnClickAction(eventsAction);


            const section = CardService.newCardSection()
                .addWidget(decoratedTextButton);

            mails.push(section);
        }
    }

    return mails;
}


export const buildHomeCard = () => {
    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);


    const mails = getMails();


    const addAction = CardService.newAction()
        .setFunctionName('handleAddPage');
    const addButton = CardService.newDecoratedText()
        .setText('Add Mail')
        .setIconUrl(ADD_ICON_URL)
        .setOnClickAction(addAction);


    const resetAction = CardService.newAction()
        .setFunctionName('reset');
    const resetButton = CardService.newDecoratedText()
        .setText('Clear All')
        .setIconUrl(OBLITERATE_ICON_URL)
        .setOnClickAction(resetAction);


    const topSection = CardService.newCardSection()
        .addWidget(banner);

    const bottomSection = CardService.newCardSection()
        .addWidget(addButton)
        .addWidget(resetButton);


    const card = CardService.newCardBuilder()
        .addSection(topSection)

    for (const mail of mails) {
        card.addSection(mail);
    }

    card.addSection(bottomSection);

    return card.build();
}
// #endregion module
