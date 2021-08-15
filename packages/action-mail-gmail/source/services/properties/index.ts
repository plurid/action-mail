// #region module
export const PROPERTIES_ALL_CONFIGS = 'all-configs';
export const PROPERTIES_ADD_CONFIG = 'add-new-config';



export const propertiesGet = (
    key: string,
    json: boolean = true,
) => {
    try {
        const propertiesService = PropertiesService.getUserProperties();
        const value = propertiesService.getProperty(key);
        if (!value) {
            return;
        }

        if (!json) {
            return value;
        }

        return JSON.parse(value);
    } catch (error) {
        return;
    }
}


export const propertiesSet = (
    key: string,
    value: any,
    json: boolean = true,
) => {
    const propertiesService = PropertiesService.getUserProperties();
    const propertiesValue = json ? JSON.stringify(value) : value;
    propertiesService.setProperty(key, propertiesValue);
}


export const propertiesDelete = (
    key: string,
) => {
    const propertiesService = PropertiesService.getUserProperties();
    propertiesService.deleteProperty(key);
}


export const propertiesReset = () => {
    const propertiesService = PropertiesService.getUserProperties();
    propertiesService.deleteAllProperties();
}


export const propertiesUpdateAllConfigs = (
    config: string,
) => {
    let allConfigs = propertiesGet(PROPERTIES_ALL_CONFIGS);
    if (!allConfigs) {
        propertiesSet(
            PROPERTIES_ALL_CONFIGS,
            [
                config,
            ],
        );
        return;
    }

    const allConfigsUnique = new Set<string>([
        ...allConfigs,
        config,
    ]);

    propertiesSet(
        PROPERTIES_ALL_CONFIGS,
        [
            ...allConfigsUnique,
        ],
    );

    propertiesDelete(
        PROPERTIES_ADD_CONFIG,
    );
}
// #endregion module
