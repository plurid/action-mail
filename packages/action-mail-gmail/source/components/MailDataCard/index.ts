// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
        DELETE_ICON_URL,

        ADD_ICON_URL,
    } from '~data/constants';

    import {
        MailConfiguration,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const MailDataCard = (
    data?: MailConfiguration,
) => {
    const toMailValue = data?.toMail || '';
    const configID = toMailValue ? `config-${toMailValue}` : '';
    const endpointValue = data?.endpoint || '';
    const tokenValue = data?.token || '';
    const publicKeyValue = data?.publicKey || '';
    const gatewayTokenValue = data?.gatewayToken || '';
    const useAttachmentsValue = data?.useAttachments ?? false;
    const parseSubjectValue = data?.parseSubject ?? false;
    const spacerValue = data?.spacer || '';
    const camelCaseKeysValue = data?.camelCaseKeys ?? false;
    const fieldersValue = data?.fielders ?? '{ }';


    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);


    const header = CardService.newTextParagraph()
        .setText(`<b>${configID ? 'Edit' : 'Add'} Mail</b>`);


    const onChangeAction = CardService.newAction()
        .setFunctionName('onChangeAddPage');


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


    const publicKey = CardService.newTextInput()
        .setFieldName('publicKey')
        .setOnChangeAction(onChangeAction)
        .setTitle('public key')
        .setMultiline(true)
        .setValue(publicKeyValue);


    const gatewayToken = CardService.newTextInput()
        .setFieldName('gatewayToken')
        .setOnChangeAction(onChangeAction)
        .setTitle('gateway token')
        .setValue(gatewayTokenValue);


    const useAttachmentsSwitch = CardService.newSwitch()
        .setFieldName('useAttachments')
        .setValue('true')
        .setOnChangeAction(onChangeAction)
        .setSelected(useAttachmentsValue)
        .setControlType(
            CardService.SwitchControlType.CHECK_BOX,
        );
    const useAttachments = CardService.newDecoratedText()
        .setText('use attachments')
        .setSwitchControl(
            useAttachmentsSwitch,
        );


    const parseSubjectSwitch = CardService.newSwitch()
        .setFieldName('parseSubject')
        .setValue('true')
        .setOnChangeAction(onChangeAction)
        .setSelected(parseSubjectValue)
        .setControlType(
            CardService.SwitchControlType.CHECK_BOX,
        );
    const parseSubject = CardService.newDecoratedText()
        .setText('parse subject')
        .setSwitchControl(
            parseSubjectSwitch,
        );


    const spacer = CardService.newTextInput()
        .setFieldName('spacer')
        .setOnChangeAction(onChangeAction)
        .setTitle('spacer')
        .setValue(spacerValue);


    const camelCaseKeysSwitch = CardService.newSwitch()
        .setFieldName('camelCaseKeys')
        .setValue('true')
        .setOnChangeAction(onChangeAction)
        .setSelected(camelCaseKeysValue)
        .setControlType(
            CardService.SwitchControlType.CHECK_BOX,
        );
    const camelCaseKeys = CardService.newDecoratedText()
        .setText('camel case keys')
        .setSwitchControl(
            camelCaseKeysSwitch,
        );


    const fielders = CardService.newTextInput()
        .setFieldName('fielders')
        .setOnChangeAction(onChangeAction)
        .setTitle('fielders')
        .setValue(fieldersValue)
        .setHint('space separated, each line a fielder pair')
        .setMultiline(true);


    const addAction = CardService.newAction()
        .setFunctionName('submitAddPage');
    const addButton = CardService.newDecoratedText()
        .setText(configID ? 'Update' : 'Add')
        .setIconUrl(ADD_ICON_URL)
        .setOnClickAction(addAction);


    const deleteMailAction = CardService
        .newAction()
        .setFunctionName('deleteMail')
        .setParameters({
            id: configID,
        });
    const deleteMailButton = CardService.newDecoratedText()
        .setText('Delete')
        .setIconUrl(DELETE_ICON_URL)
        .setOnClickAction(deleteMailAction);



    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(header)
        .addWidget(toMail)
        .addWidget(endpoint)
        .addWidget(endpointType)
        .addWidget(token)
        .addWidget(tokenType)
        .addWidget(publicKey)
        .addWidget(gatewayToken)
        .addWidget(useAttachments)
        .addWidget(parseSubject)
        .addWidget(spacer)
        .addWidget(camelCaseKeys)
        .addWidget(fielders)
        .addWidget(addButton);

    if (configID) {
        section.addWidget(deleteMailButton);
    }


    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module



// #region exports
export default MailDataCard;
// #endregion exports
