// #region imports
    // #region external
    import {
        ParserOption,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
/**
 * Based on https://stackoverflow.com/a/2970667/6639124
 *
 * @param value
 * @returns
 */
const stringToCamelCase = (
    value: string,
) => {
    return value
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0
                ? word.toLowerCase()
                : word.toUpperCase();
        })
        .replace(/\s+/g, '');
}


const negations = [
    /^no\s/,
    /^not\s/,
    /^none\s/,
    /^don't\s/,
    /^do not\s/,
];

const valueOfToken = (
    token: string,
    options?: Partial<ParserOption>,
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


const parser = <T = any>(
    data: string,
    options?: Partial<ParserOption>,
) => {
    const split = data.split('');
    const tokens: string[] = [];


    let captureIndexStart;

    for (const [index, character] of split.entries()) {
        switch (character) {
            case '{':
                captureIndexStart = index + 1;
                break;
            case '}':
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



// #region exports
export default parser;
// #endregion exports
