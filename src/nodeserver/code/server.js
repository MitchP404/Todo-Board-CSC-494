/*
    The express server that produces the todo list 
*/

import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';

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

    //Set what to do when a message is received
    ws.on('message', (msg, isBinary) => {
        console.log(msg);

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