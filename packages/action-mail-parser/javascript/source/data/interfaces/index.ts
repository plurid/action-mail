// #region module
export interface RegistryEntry {
    type: string;
    shape: Record<string, 'string' | 'boolean'>;
    groupsLength?: number;
};

export interface RegistryParse<T = any> {
    type: string;
    values: T;
};


export interface ParserOptions {
    /**
     * Delimiting string between multiple fields within the same action mail group
     *
     * e.g. `{one: two · three: four}` with `·` as spacer.
     */
    spacer: string;

    /**
     * The name of the groups key.
     *
     * Default: `'groups'`
     */
    groupsKey: string;

    /**
     * Use `camelCase` for all the keys.
     */
    camelCaseKeys: boolean;

    /**
     * Field start-end pairs.
     *
     * The first element marks field start, the second element marks field end.
     *
     * Default `[ ['{', '}'] ]`.
     */
    fielders: string[][];
}
// #endregion module
