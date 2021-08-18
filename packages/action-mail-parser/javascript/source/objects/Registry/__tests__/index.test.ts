// #region imports
    // #region libraries
    import Registry from '../index';
    // #endregion libraries
// #endregion imports



// #region module
describe('Registry', () => {
    it('works', () => {
        const registry = new Registry();

        registry.register({
            type: 'one',
            shape: {
                two: 'string',
                three: 'boolean',
            },
        });

        registry.register({
            type: 'two',
            shape: {
                three: 'string',
            },
        });


        const dataOne = `one {two: data one} {three}`;
        const parseOne = registry.parse<{
            two: string;
            three: boolean;
        }>(dataOne);

        expect(parseOne?.type).toBe('one');
        expect(parseOne?.values.two).toBe('data one');
        expect(parseOne?.values.three).toBe(true);


        const dataTwo = `two {three: }`;
        const parseTwo = registry.parse(dataTwo);

        expect(parseTwo?.type).toBe('two');


        const dataThree = `six {seven} {eight: }`;
        const parseThree = registry.parse(dataThree);

        expect(parseThree).toBe(undefined);
    });
});
// #endregion module
