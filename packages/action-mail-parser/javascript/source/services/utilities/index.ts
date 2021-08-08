// #region module
export const computeKeysStringFromObject = (
    object: any,
) => {
    const keysList = [];

    for (const key in object) {
        keysList.push(key);
    }

    const keys = keysList.sort().join('');

    return keys;
}


/**
 * Based on https://stackoverflow.com/a/2970667/6639124
 *
 * @param value
 * @returns
 */
export const stringToCamelCase = (
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
// #endregion module
