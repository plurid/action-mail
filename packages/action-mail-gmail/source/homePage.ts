// #region module
function handleHomePage() {
    const card = buildHomeCard();

    return [card];
}


const buildHomeCard = () => {
    const banner = CardService.newImage()
        .setImageUrl('https://raw.githubusercontent.com/plurid/action-mail/master/about/identity/action-mail-banner.png');


    const searchField = CardService.newTextInput()
        .setFieldName("query")
        .setHint("Email address")
        .setTitle("Search for Actionable Emails");

    const onSubmitAction = CardService.newAction()
        .setFunctionName("onSearch")
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);

    const submitButton = CardService.newTextButton()
        .setText("Search")
        .setOnClickAction(onSubmitAction);

    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(searchField)
        .addWidget(submitButton);

    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module
