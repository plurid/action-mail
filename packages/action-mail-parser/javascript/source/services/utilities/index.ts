// #region module
export const computeKeysStringFromObject = (
    object: any,
) => {
    let keys = Object
        .keys(object)
        .sort()
        .reduce((accumulator, value) => accumulator + value);

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
