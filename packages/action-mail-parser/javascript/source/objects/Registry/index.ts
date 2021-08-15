// #region imports
    // #region external
    import {
        RegistryEntry,
        RegistryParse,
        ParserOptions,
    } from '~data/interfaces';

    import parser from '~functions/parser';

    import {
        computeKeysStringFromObject,
    } from '~services/utilities';
    // #endregion external
// #endregion imports



// #region module
class Registry {
    private entries: Map<string, RegistryEntry> = new Map();


    public register(
        entry: RegistryEntry,
    ) {
        const shapeKeys = computeKeysStringFromObject(entry.shape);

        this.entries.set(
            shapeKeys,
            entry,
        );
    }

    public parse<T = any>(
        data: string,
        options?: Partial<ParserOptions>,
    ): RegistryParse<T> | undefined {
        const values = parser<T>(
            data,
            options,
        );
        if (!values) {
            return;
        }

        const valuesKeys = computeKeysStringFromObject(values);

        const entry = this.entries.get(valuesKeys);
        if (!entry) {
            return;
        }

        return {
            type: entry.type,
            values,
        };
    }
}
// #endregion module



// #region exports
export default Registry;
// #endregion exports
