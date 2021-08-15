// #region imports
    import {
        PROPERTIES_ADD_CONFIG,

        propertiesSet,
        propertiesGet,
        propertiesUpdateAllConfigs,
    } from '../../services/properties';

    import {
        handleHomePage,
    } from '../Home';

    import MailDataCard from '../../components/MailDataCard';
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


export function onChangeAddPage(
    event: any,
) {
    const data: any = {};

    for (const field of addPageFields) {
        let value = event.formInput[field];

        if (value) {
            if (value === 'true') {
                value = true;
            }

            if (value === 'false') {
                value = false;
            }

            data[field] = value;
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
