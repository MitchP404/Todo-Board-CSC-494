/*
    The express server that produces the todo list 
*/

const DatabaseConnector = require('./DatabaseConnector.js');
const express = require('express');
const { WebSocket, WebSocketServer } = require('ws');

const app = express(); //Initialize an express server
const port = /*process.env.PORT ||*/ 3000; // Use either the PORT environment variable or port 3000

// Error handler for errors that occur when HTTP server is handling issue (pre-upgrade)
function onSocketPreError(e) {
    console.log(e);
}

// Error handler for errors that occur when wss is handling issue (post-upgrade)
function onSocketPostError(e) {
    console.log(e);
}

// The IP address of the database
const dbIP = "db";

// The port used to access the database
const dbPort = 3306;

// The user under which we do database commands
const dbUser = 'root';

// The password used to send database commands
const dbPassword = 'testytests';

// The name of the database
const dbName = "ToDoBoardData";

//Create object that connects back to our database container
let dbc = new DatabaseConnector(dbIP, dbPort, dbUser, dbPassword, dbName);

let connected = false;

//Connect to the database
dbc.connect().then(
    //Resolve function
    () => {
        console.log("Connected to Database with thread id " + dbc.connection.threadId);
        connected = true;
    }
    ,
    //Reject function
    (error) => {
        console.error("Failed to connect to the database: " + error.stack);
    }
).finally(() => {
    runServer(); //Run the server after connecting to the database
});

function runServer() {

    console.log(`Attempting to run server on port ${port}`);

    const server = app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });

    // The web socket server that runs alongside the HTTP server
    const wss = new WebSocketServer({ noServer: true });

    // Moves a socket into wss after performing authentication on the HTTP server
    server.on('upgrade', (req, socket, head) => {
        socket.on('error', onSocketPreError);

        // perform auth
        // I have no login system so this isn't helpful. But I left it
        // in case I wanted to add it later.
        /*
        if(!!req.headers['BadAuth']) { //TODO: replace with actual authentication
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        */

        //Give the socket to wss
        wss.handleUpgrade(req, socket, head, (ws) => {
            //We don't want to use the PreError handler any more
            socket.removeListener('error', onSocketPreError);
            //Start a connection on the web socket
            wss.emit('connection', ws, req);
        });

    });

    // Runs when doing a new web socket connection
    wss.on('connection', (ws, req) => {
        //Set the error handler to PostError
        ws.on('error', onSocketPostError);

        // Send the item list to the endpoint
        dbc.getItems().then(
            //Resolve
            (results) => {
                console.log("Items obtained, sending...");
                ws.emit(JSON.stringify(results));
            },
            //Reject
            (error) => {
                console.error("Could not obtain items: " + error.stack);
                ws.emit("ITEM RETRIEVAL ERROR");
            }
        );

        //Set what to do when a message is received
        ws.on('message', (msg, isBinary) => {
            console.log('Message received: ' + msg);
            msgContent = JSON.parse(msg);
            
            // Create To-Do item command
            if(msgContent.command == "create") {

            }

            // Update To-Do item command
            else if(msgContent.command == "update") {

            }

            // Remove To-Do item command 
            else if(msgContent.command == "remove") {

            }

            //Example of how to send data to each open client
            /*
            wss.clients.forEach((client) => {
                if(client.readyState === WebSocket.OPEN) {
                    client.send(msg, { binary: isBinary });
                }
            });
            */
        });

        ws.on('close', () => {
            console.log('Connection Closed');
        });
    });
}