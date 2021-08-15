// #region imports
    // #region external
    import {
        defaultFielders,
    } from '~data/constants';

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

    it(`parses groups`, () => {
        const data = `one {two: three · four}`;
        const values = parser(
            data,
            {
                spacer: '·',
            },
        );

        expect(Object.values(values).length).toBe(1);
        expect(values.groups[0].two).toBe('three');
        expect(values.groups[0].four).toBe(true);
    });

    it(`parses negations`, () => {
        const data = `one {two} three {not four}`;
        const values = parser(
            data,
        );

        expect(Object.values(values).length).toBe(2);
        expect(values.two).toBe(true);
        expect(values.four).toBe(false);
    });

    it(`parses multiple fielders`, () => {
        const data = `one {two} three [four]`;
        const values = parser(
            data,
            {
                fielders: [
                    ...defaultFielders,
                    ['[', ']'],
                ],
            },
        );

        expect(Object.values(values).length).toBe(2);
        expect(values.two).toBe(true);
        expect(values.four).toBe(true);
    });
});
// #endregion module
