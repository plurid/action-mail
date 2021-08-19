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
     * Delimiting string between multiple fields within the same action mail group.
     *
     * e.g. `{one: two · three: four}` with `·` as spacer.
     *
     * Default: none
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
     *
     * Default: `false`
     */
    camelCaseKeys: boolean;

    /**
     * Field start-end pairs.
     *
     * The first element marks field start, the second element marks field end.
     *
     * Default: `[ ['{', '}'] ]`
     */
    fielders: string[][];

    /**
     * Negation words (strings or regular expressions) to negate the value of a field.
     *
     * e.g. `{no foo}` gives `{ foo: false }`.
     *
     * Default: `[ 'no', 'not', 'none', 'don\'t', 'do not' ]`
     */
    negations: Negation[];
}


export type Negation = string | RegExp;
// #endregion module
