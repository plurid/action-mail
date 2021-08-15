// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
        ADD_ICON_URL,
        DELETE_ICON_URL,
    } from '~data/constants';

    import {
        propertiesGet,
        propertiesReset,
        propertiesDelete,
    } from '~services/properties';

    import MailDataCard from '~components/MailDataCard';
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


export function deleteMail(
    data: any,
) {
    const id = data.parameters.id;
    propertiesDelete(id);
}


export function reset() {
    propertiesReset();
}



export const buildHomeCard = () => {
    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);

    let allConfigs = propertiesGet(`all-configs`);

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
                .addWidget(deleteMailButton);

            mails.push(section);
        }
    }


    const addAction = CardService.newAction().setFunctionName('handleAddPage')
    const addButton = CardService.newImageButton()
        .setIconUrl(ADD_ICON_URL)
        .setOnClickAction(addAction);


    const resetAction = CardService.newAction().setFunctionName('reset')
    const resetButton = CardService.newImageButton()
        .setIconUrl(DELETE_ICON_URL)
        .setOnClickAction(resetAction);


    const section = CardService.newCardSection()
        .addWidget(banner);

    for (const mail of mails) {
        section.addWidget(mail);
    }

    section.addWidget(addButton);
    section.addWidget(resetButton);

    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module
