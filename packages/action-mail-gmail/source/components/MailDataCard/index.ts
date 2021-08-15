// #region module
const MailDataCard = (
    data?: any,
) => {
    const toMailValue = data?.toMail || '';
    const endpointValue = data?.endpoint || '';
    const tokenValue = data?.token || '';
    const spacerValue = data?.spacer || '';

    const banner = CardService.newImage()
        .setImageUrl('https://raw.githubusercontent.com/plurid/action-mail/master/about/identity/action-mail-banner.png');


    const onChangeAction = CardService.newAction().setFunctionName('onChangeAddPage');


    const toMail = CardService.newTextInput()
        .setFieldName('toMail')
        .setOnChangeAction(onChangeAction)
        .setTitle('to mail')
        .setValue(toMailValue);

    const endpoint = CardService.newTextInput()
        .setFieldName('endpoint')
        .setOnChangeAction(onChangeAction)
        .setTitle('endpoint')
        .setValue(endpointValue);

    const endpointType = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle('endpoint type')
        .setFieldName('endpointType')
        .setOnChangeAction(onChangeAction)
        .addItem('REST', 'rest', true)
        .addItem('GraphQL', 'graphql', false);


    const token = CardService.newTextInput()
        .setFieldName('token')
        .setOnChangeAction(onChangeAction)
        .setTitle('token')
        .setValue(tokenValue);

    const tokenType = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle('token type')
        .setFieldName('tokenType')
        .setOnChangeAction(onChangeAction)
        .addItem('payload', 'payload', true)
        .addItem('bearer', 'bearer', false);


    const useAttachments = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle('use attachments')
        .setFieldName('useAttachments')
        .setOnChangeAction(onChangeAction)
        .addItem('yes', 'true', true)
        .addItem('no', 'false', false);


    const spacer = CardService.newTextInput()
        .setFieldName('spacer')
        .setOnChangeAction(onChangeAction)
        .setTitle('spacer')
        .setValue(spacerValue);

    const camelCaseKeys = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle('camel case keys')
        .setFieldName('camelCaseKeys')
        .setOnChangeAction(onChangeAction)
        .addItem('yes', 'true', true)
        .addItem('no', 'false', false);


    const addAction = CardService.newAction().setFunctionName('submitAddPage');
    const addButton = CardService.newImageButton()
        .setIconUrl('https://www.freepnglogos.com/uploads/plus-icon/plus-icon-plus-svg-png-icon-download-1.png')
        .setOnClickAction(addAction);


    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(toMail)
        .addWidget(endpoint)
        .addWidget(endpointType)
        .addWidget(token)
        .addWidget(tokenType)
        .addWidget(useAttachments)
        .addWidget(spacer)
        .addWidget(camelCaseKeys)
        .addWidget(addButton);


    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module



// #region exports
export default MailDataCard;
// #endregion exports