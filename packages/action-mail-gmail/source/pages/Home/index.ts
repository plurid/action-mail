// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
        ADD_ICON_URL,
        EVENTS_ICON_URL,
        DELETE_ICON_URL,
        OBLITERATE_ICON_URL,

        PROPERTIES_ALL_CONFIGS,
    } from '~data/constants';

    import {
        propertiesGet,
        propertiesReset,
        propertiesDelete,
    } from '~services/properties';

    import MailDataCard from '~components/MailDataCard';
    import EventsCard from '~components/EventsCard';
    // #endregion external
// #endregion imports



// #region module
export function handleHomePage() {
    const card = buildHomeCard();

    return [card];
}


export function viewConfig (
    data: any,
) {
    const id = data.parameters.id;

    const configData = propertiesGet(id);
    if (!configData) {
        return;
    }

    const card = MailDataCard(configData);
    return [card];
}


export function viewEvents(
    data: any,
) {
    const id = data.parameters.id;

    const eventsCard = EventsCard(id);

    return [eventsCard];
}


export function deleteMail(
    data: any,
) {
    const id = data.parameters.id;
    propertiesDelete(id);
}


export function reset() {
    propertiesReset();
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

            const mailAction = CardService
                .newAction()
                .setFunctionName('viewConfig')
                .setParameters({
                    id: config,
                });
            const mailButton = CardService
                .newTextButton()
                .setText(`${configData.toMail}`)
                .setOnClickAction(mailAction);


            const eventsAction = CardService
                .newAction()
                .setFunctionName('viewEvents')
                .setParameters({
                    id: config,
                });
            const eventsButton = CardService.newImageButton()
                .setIconUrl(EVENTS_ICON_URL)
                .setOnClickAction(eventsAction);


            const deleteMailAction = CardService
                .newAction()
                .setFunctionName('deleteMail')
                .setParameters({
                    id: config,
                });
            const deleteMailButton = CardService.newImageButton()
                .setIconUrl(DELETE_ICON_URL)
                .setOnClickAction(deleteMailAction);


            const section = CardService.newCardSection()
                .addWidget(mailButton)
                .addWidget(eventsButton)
                .addWidget(deleteMailButton);

            mails.push(section);
        }
    }

    return mails;
}


export const buildHomeCard = () => {
    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);


    const mails = getMails();


    const addAction = CardService.newAction().setFunctionName('handleAddPage')
    const addButton = CardService.newImageButton()
        .setIconUrl(ADD_ICON_URL)
        .setOnClickAction(addAction);


    const resetAction = CardService.newAction().setFunctionName('reset')
    const resetButton = CardService.newImageButton()
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
