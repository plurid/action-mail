// #region imports
    import {
        CACHE_ADD_CONFIG,

        cacheSet,
        cacheGet,
        cacheUpdateAllConfigs,
    } from './cache';

    import {
        handleHomePage,
    } from './homePage';
// #endregion imports



// #region module
export function handleAddPage() {
    const card = buildAddCard();
    return [card];
};


export const addPageFields = [
    'toMail',
    'endpoint',
    'endpointType',
    'token',
    'tokenType',
    'spacer',
    'camelCaseKeys',
];


export function onChangeAddPage(
    event: any,
) {
    const data: any = {};

    for (const field of addPageFields) {
        if (event.formInput[field]) {
            data[field] = event.formInput[field];
        }
    }

    console.log('onChangeAddPage', data);

    cacheSet(
        CACHE_ADD_CONFIG,
        data,
    );
};


export function submitAddPage() {
    const newConfigData = cacheGet(CACHE_ADD_CONFIG);
    const configName = `config-${newConfigData.toMail}`;

    cacheSet(
        configName,
        newConfigData,
    );
    cacheUpdateAllConfigs(configName);

    return handleHomePage();
}


export function buildAddCard() {
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

    const endpointType = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle("endpoint type")
        .setFieldName("endpointType")
        .setOnChangeAction(onChangeAction)
        .addItem("REST", "rest", true)
        .addItem("GraphQL", "graphql", false);


    const token = CardService.newTextInput()
        .setFieldName("token")
        .setOnChangeAction(onChangeAction)
        .setTitle("token");

    const tokenType = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle("token type")
        .setFieldName("tokenType")
        .setOnChangeAction(onChangeAction)
        .addItem("payload", "payload", true)
        .addItem("bearer", "bearer", false);



    const spacer = CardService.newTextInput()
        .setFieldName("spacer")
        .setOnChangeAction(onChangeAction)
        .setTitle("spacer");

    const camelCaseKeys = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle("camel case keys")
        .setFieldName("camelCaseKeys")
        .setOnChangeAction(onChangeAction)
        .addItem("yes", "true", true)
        .addItem("no", "false", false);


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
        .addWidget(spacer)
        .addWidget(camelCaseKeys)
        .addWidget(addButton);


    return CardService.newCardBuilder()
        .addSection(section)
        .build();
}
// #endregion module
