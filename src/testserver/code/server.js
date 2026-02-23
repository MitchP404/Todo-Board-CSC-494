/*
    Test express server using that receives a 'GET' request and responds
    with "Hello World!"
*/

// Import express functions
const express = require('express');

const app = express(); //Initialize an express application

// Use either the PORT environment variable or port 3000
// I don't currently use the PORT environment variable, so this is left out.
// However I left the code commented in case I changed my mind in the future
const port = /*process.env.PORT ||*/ 3000; 

//Define what the app does when it receives a get request to '/' (root)
app.get("/", (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost');
    res.send("Hello World!");
});

console.log(`Attempting to run server on port ${port}`);

//Run the server itself
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});