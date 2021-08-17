// #region imports
    // #region external
    import {
        BANNER_ICON_URL,

        PROPERTIES_SETTINGS,

        DEFAULT_TIME_LOCALE,
    } from '~data/constants';

    import {
        propertiesSet,
        propertiesGet,
    } from '~services/properties';
    // #endregion external
// #endregion imports



// #region module
export function handleSettingsPage() {
    const card = buildSettingsCard();

    return [card];
}


export const settingsPageFields = [
    'timeLocale',
    'autofields',
];

export function onChangeSettingsPage(
    event: any,
) {
    const data: any = {};

    for (const field of settingsPageFields) {
        const value = event.formInput[field];

        if (typeof value === 'string') {
            if (value === 'true') {
                data[field] = true;
                continue;
            }
            if (value === 'false') {
                data[field] = false;
                continue;
            }

            data[field] = value;

            continue;
        }
    }

    propertiesSet(
        PROPERTIES_SETTINGS,
        data,
    );
};


export const buildSettingsCard = () => {
    const settings = propertiesGet(PROPERTIES_SETTINGS);

    const timeLocaleValue = settings?.timeLocale || DEFAULT_TIME_LOCALE;
    const autofieldsValue = settings?.autofields || '';


    const banner = CardService.newImage()
        .setImageUrl(BANNER_ICON_URL);

    const header = CardService.newTextParagraph()
        .setText(`<b>Settings</b>`);


    const onChangeAction = CardService.newAction()
        .setFunctionName('onChangeSettingsPage');


    const timeLocale = CardService.newTextInput()
        .setFieldName('timeLocale')
        .setOnChangeAction(onChangeAction)
        .setTitle('time locale')
        .setHint('ISO 639-1 codes')
        .setValue(timeLocaleValue);

    const autofields = CardService.newTextInput()
        .setFieldName('autofields')
        .setOnChangeAction(onChangeAction)
        .setTitle('autofields')
        .setValue(autofieldsValue)
        .setHint('one per line, e.g {key: value}')
        .setMultiline(true);


    const section = CardService.newCardSection()
        .addWidget(banner)
        .addWidget(header)
        .addWidget(timeLocale)
        .addWidget(autofields);


    const card = CardService.newCardBuilder()
        .addSection(section);


    return card.build();
}
// #endregion module
