// #region module
/**
 * Based on `https://stackoverflow.com/a/2117523/6639124`.
 *
 * @param separator
 * @returns
 */
 export const uuid = (
    separator: string = '',
) => {
    return `xxxxxxxx${separator}xxxx${separator}4xxx${separator}yxxx${separator}xxxxxxxxxxxx`.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// #endregion module
