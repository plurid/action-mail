// #region imports
    // #region external
    import parser from '../index';
    // #endregion external
// #endregion imports



// #region module
describe('parser', () => {
    it(`works`, () => {
        const data = `one {two} three {four: five}`;
        const values = parser(data);

        expect(Object.values(values).length).toBe(2);
        expect(values.two).toBe(true);
        expect(values.four).toBe('five');
    });
});
// #endregion module
