// #region imports
    // #region libraries
    import express from 'express';
    import {
        json as jsonParser,
    } from 'body-parser';
    // #endregion libraries
// #endregion imports



// #region module
const PORT = 44555;


const main = async () => {
    const server = express();

    server.use(jsonParser());


    server.post('/rest', (request, response) => {
        console.log('rest endpoint hit', request.body);

        response.end();
    });

    server.post('/graphql', (request, response) => {
        console.log('graphql endpoint hit', request.body);
        console.log('input', request.body.variables.input);

        response.end();
    });


    server.listen(PORT, () => {
        console.log(`action mail test endpoint started on port ${PORT}`);
    });
}


main();
// #endregion module
