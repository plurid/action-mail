// #region imports
    // #region external
    import {
        PROPERTIES_ADD_CONFIG,
    } from '~data/constants';

    import {
        propertiesSet,
        propertiesGet,
        propertiesUpdateAllConfigs,
    } from '~services/properties';

    import {
        handleHomePage,
    } from '~pages/Home';
    // #endregion external
// #endregion imports



// #region module
export const addPageFields = [
    'toMail',
    'endpoint',
    'endpointType',
    'token',
    'tokenType',
    'publicKey',
    'gatewayToken',
    'useAttachments',
    'parseSubject',
    'spacer',
    'camelCaseKeys',
    'fielders',
];

export const addPageFieldsBooleans = [
    'useAttachments',
    'parseSubject',
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
    if (!newConfigData) {
        return handleHomePage();
    }
    if (
        !newConfigData.toMail
        || !newConfigData.endpoint
    ) {
        return handleHomePage();
    }

    const configName = `config-${newConfigData.toMail}`;


    const currentConfigData = propertiesGet(configName);

    const configData = {
        ...currentConfigData,
        ...newConfigData,
    };


    propertiesSet(
        configName,
        configData,
    );
    propertiesUpdateAllConfigs(configName);

    return handleHomePage();
}
// #endregion module
