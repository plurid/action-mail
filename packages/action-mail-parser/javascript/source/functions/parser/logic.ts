// #region imports
    // #region external
    import {
        ParserOptions,
    } from '~data/interfaces';

    import {
        negations,
    } from '~data/constants';

    import {
        stringToCamelCase,
    } from '~services/utilities';
    // #endregion external
// #endregion imports



// #region module
export const valueOfToken = (
    token: string,
    options?: Partial<ParserOptions>,
) => {
    const indexOfColon = token.indexOf(':');

    if (indexOfColon === -1) {
        let key = token.trim();
        let value = true;

        for (const negation of negations) {
            if (key.match(negation)) {
                key = key.replace(negation, '');
                value = false;
                break;
            }
        }

        if (options?.camelCaseKeys) {
            key = stringToCamelCase(key);
        }

        return {
            key,
            value,
        };
    }


    let key = token.slice(0, indexOfColon).trim();
    if (options?.camelCaseKeys) {
        key = stringToCamelCase(key);
    }

    const value = token.slice(indexOfColon + 1).trim();

    return {
        key,
        value,
    };
}


export const groupParse = <T = any>(
    start: string,
    end: string,
    data: string,
    options?: Partial<ParserOptions>,
) => {
    const split = data.split('');
    const tokens: string[] = [];


    let captureIndexStart;

    for (const [index, character] of split.entries()) {
        switch (character) {
            case start:
                captureIndexStart = index + 1;
                break;
            case end:
                if (typeof captureIndexStart === 'number') {
                    const value = data.slice(
                        captureIndexStart,
                        index,
                    );
                    if (value) {
                        tokens.push(value);
                    }
                    captureIndexStart = undefined;
                }
                break;
        }
    }


    const interpreted = {};

    const groups: any[] = [];
    let groupIndex = 0;

    for (const token of tokens) {
        if (options?.spacer) {
            const {
                spacer,
            } = options;

            if (token.includes(spacer)) {
                const split = token.split(spacer);

                groups[groupIndex] = {};

                for (const item of split) {
                    const {
                        key,
                        value,
                    } = valueOfToken(
                        item,
                        options,
                    );

                    groups[groupIndex][key] = value;
                }

                groupIndex += 1;

                continue;
            }
        }

        const {
            key,
            value,
        } = valueOfToken(
            token,
            options,
        );
        interpreted[key] = value;
    }


    if (groups.length > 0) {
        const groupsKey = options?.groupsKey || 'groups';

        interpreted[groupsKey] = groups;
    }


    return interpreted as T;
}
// #endregion module
