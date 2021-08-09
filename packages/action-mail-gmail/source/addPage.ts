// #region module
function handleAddPage() {
    const card = buildAddCard();
    return [card];
};


const addPageFields = [
    'toMail',
    'endpoint',
    'endpointType',
    'token',
    'tokenType',
    'spacer',
    'camelCaseKeys',
];

const cacheAddKey = 'add-new-config';

function onChangeAddPage(
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
        cacheAddKey,
        data,
    );
};


function updateAllConfigs(
    data: any,
) {
    let allConfigs = cacheGet(`all-configs`);

    if (!allConfigs) {
        cacheSet(
            `all-configs`,
            [data],
        );
        return;
    }

    cacheSet(
        `all-configs`,
        [
            ...allConfigs,
            data,
        ],
    );
}

function submitAddPage() {
    let data = cacheGet(cacheAddKey);

    const configName = `config-${data.toMail}`;

    cacheSet(
        configName,
        data,
    );

    updateAllConfigs(configName);

    return handleHomePage();
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
