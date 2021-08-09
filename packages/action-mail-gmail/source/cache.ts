// #region module
const CACHE_ALL_CONFIGS = 'all-configs';
const CACHE_ADD_CONFIG = 'add-new-config';



const cacheGet = (
    key: string,
    json: boolean = true,
) => {
    try {
        const cache = CacheService.getUserCache();
        const value = cache.get(key);
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


const cacheSet = (
    key: string,
    value: any,
    json: boolean = true,
) => {
    const cache = CacheService.getUserCache();
    const cacheValue = json ? JSON.stringify(value) : value;
    cache.put(key, cacheValue);
}


const cacheReset = () => {
    const cache = CacheService.getUserCache();

    const allConfigs = cacheGet(CACHE_ALL_CONFIGS) || [];

    cache.removeAll([
        ...allConfigs,
        CACHE_ALL_CONFIGS,
    ]);
}


const cacheUpdateAllConfigs = (
    config: string,
) => {
    let allConfigs = cacheGet(CACHE_ALL_CONFIGS);

    if (!allConfigs) {
        cacheSet(
            CACHE_ALL_CONFIGS,
            [
                config,
            ],
        );
        return;
    }

    cacheSet(
        CACHE_ALL_CONFIGS,
        [
            ...allConfigs,
            config,
        ],
    );
}
// #endregion module
