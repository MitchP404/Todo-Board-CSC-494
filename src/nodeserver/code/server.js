/*
    The express server that produces the todo list 
*/

const DatabaseConnector = require('./DatabaseConnector.js');
const express = require('express');
const { WebSocket, WebSocketServer } = require('ws');
const { ServerMessages, ClientMessages, Message } = require('../../common/Message.js');

const app = express(); //Initialize an express server
const port = /*process.env.PORT ||*/ 3000; // Use either the PORT environment variable or port 3000

// Error handler for errors that occur when HTTP server is handling issue (pre-upgrade)
function onSocketPreError(e) {
    console.error(e);
}

// Error handler for errors that occur when wss is handling issue (post-upgrade)
function onSocketPostError(e) {
    console.error(e);
}

// Make sure web socket connection hasn't dropped
//TODO: Implement fully
//function heartbeat() {
//    this.isAlive = true;
//}

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
                m = new Message(ws, ServerMessages.SENDALL, results, (error) => {
                    if(!!error) {
                        console.log(error);
                    } else {
                        console.log("Items sent.");
                    }
                });
                m.send();
            },
            //Reject
            (error) => {
                console.error("Could not obtain items: " + error.stack);
                ws.emit("ITEM RETRIEVAL ERROR");
            }
        );

        //Set that the socket is active and to keep it active if a pong is received
        //TODO: Uncomment to test, alongside other related code
        //ws.isAlive = true;
        //ws.on('pong', heartbeat);

        //Set what to do when a message is received
        ws.on('message', (msg, isBinary) => {
            /*
            console.log(`Received message: ${msg.data}`);
            let m = JSON.parse(msg.data); //The contents of the message
            let boardsHTML = document.getElementById('boards'); //The item on the page where the to do items are located
            switch(m.type){
                case ClientMessages.UPDATE:
                    
                    break;
                //Errors
                case ServerMessages.ERR_SETUP_RETRIEVAL:
                    
                    break;
                    
                default:
                    console.error("UNRECOGNIZED WEBSOCKET MESSAGE TYPE");
                    break;
            */
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

    // Regularly check if the sockets are still alive
    //TODO: Uncomment to test, alongside other related code
    /*
    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);
    */
}