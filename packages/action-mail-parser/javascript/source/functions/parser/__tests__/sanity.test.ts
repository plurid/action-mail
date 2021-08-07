// #region imports
    // #region external
    import parser from '../index';
    // #endregion external
// #endregion imports



// #region module
describe('parser', () => {
    it(`simply works`, () => {
        const data = `one {two} three {four: five}`;
        const values = parser(data);

        expect(Object.values(values).length).toBe(2);
        expect(values.two).toBe(true);
        expect(values.four).toBe('five');
    });

    it(`parses spaced`, () => {
        const data = `one {two: three four}`;
        const values = parser(data);

        expect(Object.values(values).length).toBe(1);
        expect(values.two).toBe('three four');
    });

    it(`parses no value`, () => {
        const data = `one {two: }`;
        const values = parser(data);

        expect(Object.values(values).length).toBe(1);
        expect(values.two).toBe('');
    });
});
// #endregion module
