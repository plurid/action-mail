// #region module
const parser = (
    data: string,
) => {
    const split = data.split('');
    const tokens: string[] = [];


    let captureIndexStart;

    for (const [index, character] of split.entries()) {
        switch (character) {
            case '{':
                captureIndexStart = index;
                break;
            case '}':
                if (typeof captureIndexStart === 'number') {
                    const value = data.slice(
                        captureIndexStart,
                        index,
                    );
                    tokens.push(value);
                    captureIndexStart = undefined;
                }
                break;
        }
    }


    const interpreted = {};

    for (const token of tokens) {
        const split = token.split(':');

        if (split.length === 2) {
            const key = split[0].trim();
            const value = split[1].trim();
            interpreted[key] = value;
            continue;
        }

        interpreted[token] = true;
    }

    return interpreted;
}
// #endregion module



// #region exports
export default parser;
// #endregion exports
