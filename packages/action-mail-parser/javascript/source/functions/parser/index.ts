// #region module
const parser = <T = any>(
    data: string,
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

    console.log(tokens);


    const interpreted = {};

    for (const token of tokens) {
        const indexOfColon = token.indexOf(':');

        if (indexOfColon === -1) {
            interpreted[token] = true;
            continue;
        }

        const key = token.slice(0, indexOfColon).trim();
        const value = token.slice(indexOfColon + 1).trim();
        interpreted[key] = value;
    }
    console.log(interpreted);


    return interpreted as T;
}
// #endregion module



// #region exports
export default parser;
// #endregion exports
