// #region module
function handleHomePage() {
    const card = buildHomeCard();

    return [card];
}


const buildHomeCard = () => {
    var banner = CardService.newImage()
        .setImageUrl('https://storage.googleapis.com/gweb-cloudblog-publish/original_images/Workforce_segmentation_1.png');

    var searchField = CardService.newTextInput()
        .setFieldName("query")
        .setHint("Email address")
        .setTitle("Search for Actionable Emails");

    var onSubmitAction = CardService.newAction()
        .setFunctionName("onSearch")
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);

    var submitButton = CardService.newTextButton()
        .setText("Search")
        .setOnClickAction(onSubmitAction);

    var section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(searchField)
        .addWidget(submitButton);

    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module
