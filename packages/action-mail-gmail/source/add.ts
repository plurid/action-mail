// #region module
function handleAddPage() {
    const card = buildAddCard();
    return [card];
};


function onChangeAddPage(
    event: any,
) {
    if (event.formInput['toMail']) {
    }

};

function submitAddPage() {
}


function buildAddCard() {
    const banner = CardService.newImage()
      .setImageUrl('https://raw.githubusercontent.com/plurid/action-mail/master/about/identity/action-mail-banner.png');


    const onChangeAction = CardService.newAction().setFunctionName('onChangeAddPage');

    const toMail = CardService.newTextInput()
      .setFieldName("toMail")
      .setOnChangeAction(onChangeAction)
      .setTitle("to mail");

    const endpoint = CardService.newTextInput()
      .setFieldName("endpoint")
      .setOnChangeAction(onChangeAction)
      .setTitle("endpoint");

    var endpointType = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle("endpoint type")
        .setFieldName("endpointType")
        .setOnChangeAction(onChangeAction)
        .addItem("REST", "endpointTypeRest", true)
        .addItem("GraphQL", "endpointTypeGraphql", false);

    const spacer = CardService.newTextInput()
      .setFieldName("spacer")
      .setOnChangeAction(onChangeAction)
      .setTitle("spacer");

    const token = CardService.newTextInput()
      .setFieldName("token")
      .setOnChangeAction(onChangeAction)
      .setTitle("token");

    const tokenType = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle("token type")
        .setFieldName("tokenType")
        .setOnChangeAction(onChangeAction)
        .addItem("payload", "tokenTypePayload", true)
        .addItem("bearer", "tokenTypeBearer", false);

    const addAction = CardService.newAction().setFunctionName('submitAddPage');
    const addButton = CardService.newImageButton()
        .setIconUrl('https://www.freepnglogos.com/uploads/plus-icon/plus-icon-plus-svg-png-icon-download-1.png')
        .setOnClickAction(addAction);


    const section = CardService.newCardSection()
      .addWidget(banner)
      .addWidget(toMail)
      .addWidget(endpoint)
      .addWidget(endpointType)
      .addWidget(spacer)
      .addWidget(token)
      .addWidget(tokenType)
      .addWidget(addButton)


    return CardService.newCardBuilder()
      .addSection(section)
      .build();
}
// #endregion module
