// #region imports
    // #region external
    import {
        ParserOption,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const valueOfToken = (
    token: string,
) => {
    const indexOfColon = token.indexOf(':');

    if (indexOfColon === -1) {
        let value = true;

        const negations = [
            'no',
            'none',
            'don\'t',
            'do not',
        ];

        return {
            key: token,
            value,
        };
    }

    const key = token.slice(0, indexOfColon).trim();
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
                    } = valueOfToken(item);

                    groups[groupIndex][key] = value;
                }

                groupIndex += 1;

                continue;
            }
        }

        const {
            key,
            value,
        } = valueOfToken(token);
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
