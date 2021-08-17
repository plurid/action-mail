// #region imports
    import {
        PROPERTIES_ADD_CONFIG,
    } from '~data/constants';

    import {
        propertiesSet,
        propertiesGet,
        propertiesUpdateAllConfigs,
    } from '~services/properties';

    import MailDataCard from '~components/MailDataCard';


    import {
        handleHomePage,
    } from '../Home';
// #endregion imports



// #region module
export function handleAddPage() {
    const card = MailDataCard();
    return [card];
};


export const addPageFields = [
    'toMail',
    'endpoint',
    'endpointType',
    'token',
    'tokenType',
    'useAttachments',
    'spacer',
    'camelCaseKeys',
];

export const addPageFieldsBooleans = [
    'useAttachments',
    'camelCaseKeys',
];


export function onChangeAddPage(
    event: any,
) {
    const data: any = {};

    for (const field of addPageFields) {
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

        if (!value && addPageFieldsBooleans.includes(field)) {
            data[field] = false;
            continue;
        }
    }

    propertiesSet(
        PROPERTIES_ADD_CONFIG,
        data,
    );
};


export function submitAddPage() {
    const newConfigData = propertiesGet(PROPERTIES_ADD_CONFIG);
    const configName = `config-${newConfigData.toMail}`;
    if (!newConfigData || !configName) {
        return;
    }


    const currentConfigData = propertiesGet(configName);

    const configData = {
        ...currentConfigData,
        ...newConfigData,
    };

    if (
        !configData.toMail
        || !configData.endpoint
    ) {
        return;
    }

    propertiesSet(
        configName,
        configData,
    );
    propertiesUpdateAllConfigs(configName);

    return handleHomePage();
}
// #endregion module
