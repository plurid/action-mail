// #region module
function handleHomePage() {
    const card = buildHomeCard();

    return [card];
}


const buildHomeCard = () => {
    const banner = CardService.newImage()
        .setImageUrl('https://raw.githubusercontent.com/plurid/action-mail/master/about/identity/action-mail-banner.png');

    let allConfigs = cacheGet(`all-configs`);
    console.log('allConfigs', allConfigs);

    if (allConfigs) {
        for (const config of allConfigs) {
            const configData = cacheGet(config);
            if (!configData) {
                continue;
            }

            console.log('configData', configData);
        }
    }


    const addAction = CardService.newAction().setFunctionName('handleAddPage')
    const addButton = CardService.newImageButton()
        .setIconUrl('https://www.freepnglogos.com/uploads/plus-icon/plus-icon-plus-svg-png-icon-download-1.png')
        .setOnClickAction(addAction);

    // const searchField = CardService.newTextInput()
    //     .setFieldName("query")
    //     .setHint("Email address")
    //     .setTitle("Search for Actionable Emails");

    // const onSubmitAction = CardService.newAction()
    //     .setFunctionName("onSearch")
    //     .setLoadIndicator(CardService.LoadIndicator.SPINNER);

    // const submitButton = CardService.newTextButton()
    //     .setText("Search")
    //     .setOnClickAction(onSubmitAction);

    // const section = CardService.newCardSection()
    //     .addWidget(banner)
    //     .addWidget(searchField)
    //     .addWidget(submitButton);

    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(addButton);

    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module
