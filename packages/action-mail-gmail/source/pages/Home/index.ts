// #region imports
    import {
        cacheGet,
        cacheReset,
    } from '../../services/cache';
// #endregion imports


// #region module
export function handleHomePage() {
    const card = buildHomeCard();

    return [card];
}


export function viewConfig (
    id: string,
) {
    console.log(id);
}

export function reset() {
    cacheReset();
}



export const buildHomeCard = () => {
    const banner = CardService.newImage()
        .setImageUrl('https://raw.githubusercontent.com/plurid/action-mail/master/about/identity/action-mail-banner.png');

    let allConfigs = cacheGet(`all-configs`);

    const buttons: GoogleAppsScript.Card_Service.TextButton[] = [];

    if (allConfigs) {
        for (const config of allConfigs) {
            const configData = cacheGet(config);
            if (!configData) {
                continue;
            }

            const action = CardService
                .newAction()
                .setFunctionName('viewConfig')
                .setParameters({
                    id: config,
                });
            const button = CardService
                .newTextButton()
                .setText(`${configData.toMail}`)
                .setOnClickAction(action);

            buttons.push(button);
        }
    }


    const addAction = CardService.newAction().setFunctionName('handleAddPage')
    const addButton = CardService.newImageButton()
        .setIconUrl('https://www.freepnglogos.com/uploads/plus-icon/plus-icon-plus-svg-png-icon-download-1.png')
        .setOnClickAction(addAction);


    const resetAction = CardService.newAction().setFunctionName('reset')
    const resetButton = CardService.newImageButton()
        .setIconUrl('https://icons-for-free.com/iconfiles/png/512/delete+remove+trash+trash+bin+trash+can+icon-1320073117929397588.png')
        .setOnClickAction(resetAction);


    const section = CardService.newCardSection()
        .addWidget(banner);

    for (const button of buttons) {
        section.addWidget(button);
    }

    section.addWidget(addButton);
    section.addWidget(resetButton);

    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module
