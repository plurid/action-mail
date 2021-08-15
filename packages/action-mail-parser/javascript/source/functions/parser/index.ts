// #region imports
    // #region external
    import {
        ParserOptions,
    } from '~data/interfaces';

    import {
        defaultGroupers,
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
    const groupers = options?.groupers || defaultGroupers;
    const groupsKey = options?.groupsKey || 'groups';

    if (groupers.length === 0) {
        return;
    }


    let results: any = {};

    for (const grouper of groupers) {
        const start = grouper[0];
        const end = grouper[1];

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
