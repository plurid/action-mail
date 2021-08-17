// #region imports
    // #region external
    import {
        BANNER_ICON_URL,
        ADD_ICON_URL,
        EVENTS_ICON_URL,
        OBLITERATE_ICON_URL,
        EDIT_ICON_URL,

        PROPERTIES_ALL_CONFIGS,
        PROPERTIES_SETTINGS,
    } from '~data/constants';

    import {
        propertiesGet,
    } from '~services/properties';
    // #endregion external
// #endregion imports



// #region module
export function handleHomePage() {
    const card = buildHomeCard();

    return [card];
}


export const getMails = () => {
    let allConfigs = propertiesGet(PROPERTIES_ALL_CONFIGS);

    const mails: GoogleAppsScript.Card_Service.CardSection[] = [];

    if (allConfigs) {
        for (const config of allConfigs) {
            const configData = propertiesGet(config);
            if (!configData) {
                continue;
            }

            if (
                !configData.toMail
                || !configData.endpoint
            ) {
                continue;
            }


            const eventsAction = CardService
                .newAction()
                .setFunctionName('viewEvents')
                .setParameters({
                    id: config,
                });


            const configAction = CardService
                .newAction()
                .setFunctionName('viewConfig')
                .setParameters({
                    id: config,
                });
            const configButton = CardService.newImageButton()
                .setIconUrl(EVENTS_ICON_URL)
                .setOnClickAction(configAction);


            const decoratedTextButton = CardService.newDecoratedText()
                .setText(configData.toMail)
                .setButton(configButton)
                .setOnClickAction(eventsAction);


            const section = CardService.newCardSection()
                .addWidget(decoratedTextButton);

            mails.push(section);
        }
    }

    return mails;
}


export const autofieldDraft = (
    id: string,
    autofields: any,
) => {
    const message = GmailApp.getMessageById(id);
    if (!message) {
        return;
    }

    const body = message.getBody();

    const data = parser(
        body,
    );

    let raw = message.getRawContent();

    for (const key of Object.keys(data)) {
        if (autofields[key]) {
            const find = `${key}: `;
            const re = new RegExp(find, 'g');
            raw = raw.replace(re, `${key}: ${autofields[key]}`);
        }
    }

    Gmail.Users?.Drafts?.update(
        {
            id,
            message: {
                threadId: message.getThread().getId(),
                raw: Utilities.base64EncodeWebSafe(raw),
            },
        },
        'me',
        id,
    );
}


export const getAutofields = (
    autofieldsValue: string,
) => {
    const lines = autofieldsValue.split('\n');

    let autofields: any = {};

    for (const line of lines) {
        let lineValue = line.trim();
        const start = lineValue[0];
        const end = lineValue[lineValue.length - 1];
        const keyValue = parser(
            line,
            {
                fielders: [
                    [start, end],
                ],
            },
        );

        autofields = {
            ...autofields,
            ...keyValue,
        };
    }

    return autofields;
}


export const autofieldDrafts = () => {
    const settings = propertiesGet(PROPERTIES_SETTINGS);
    const autofieldsValue = settings?.autofields || '';
    if (!autofieldsValue) {
        return;
    }

    const autofields = getAutofields(autofieldsValue);

    const drafts = GmailApp.getDraftMessages();
    for (let i = 0; i < drafts.length; i++) {
        autofieldDraft(
            drafts[i].getId(),
            autofields,
        );
    }
}


export const buildHomeCard = () => {
    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);


    const mails = getMails();


    const addAction = CardService.newAction()
        .setFunctionName('handleAddPage');
    const addButton = CardService.newDecoratedText()
        .setText('Add Mail')
        .setIconUrl(ADD_ICON_URL)
        .setOnClickAction(addAction);


    const resetAction = CardService.newAction()
        .setFunctionName('reset');
    const resetButton = CardService.newDecoratedText()
        .setText('Clear All')
        .setIconUrl(OBLITERATE_ICON_URL)
        .setOnClickAction(resetAction);


    const topSection = CardService.newCardSection()
        .addWidget(banner);

    const bottomSection = CardService.newCardSection()
        .addWidget(addButton)
        .addWidget(resetButton);


    const card = CardService.newCardBuilder()
        .addSection(topSection)

    for (const mail of mails) {
        card.addSection(mail);
    }

    card.addSection(bottomSection);


    const autofieldAction = CardService.newAction()
        .setFunctionName('autofieldDrafts');
    const autofieldButton = CardService.newDecoratedText()
        .setText('Autofield Drafts')
        .setIconUrl(EDIT_ICON_URL)
        .setOnClickAction(autofieldAction);

    const actionsSections = CardService.newCardSection()
        .addWidget(autofieldButton);


    card.addSection(actionsSections);


    return card.build();
}
// #endregion module
