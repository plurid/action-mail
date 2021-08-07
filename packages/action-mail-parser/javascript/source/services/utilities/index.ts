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
// #endregion module
