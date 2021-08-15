// #region imports
    // #region external
    import {
        ParserOptions,
    } from '~data/interfaces';

    import {
        defaultFielders,
    } from '~data/constants';
    // #endregion external


    // #region internal
    import {
        groupParse,
    } from './logic';
    // #endregion internal
// #endregion imports



// #region module
const parser = <T = any>(
    data: string,
    options?: Partial<ParserOptions>,
) => {
    const fielders = options?.fielders || defaultFielders;
    const groupsKey = options?.groupsKey || 'groups';

    if (fielders.length === 0) {
        return;
    }


    let results: any = {};

    for (const fielder of fielders) {
        const start = fielder[0];
        const end = fielder[1];

        if (!start || !end) {
            console.log('action mail :: invalid fielders');
            continue;
        }

        const result = groupParse(
            start,
            end,
            data,
            options,
        );

        if (result[groupsKey]) {
            result[groupsKey] = {
                ...results[groupsKey],
                ...result[groupsKey],
            };
        }

        results = {
            ...results,
            ...result,
        };
    }

    return results as T;
}
// #endregion module



// #region exports
export default parser;
// #endregion exports
