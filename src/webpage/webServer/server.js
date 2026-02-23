/*
    The express server that produces the todo list 
*/

import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';

const app = express(); //Initialize an express server
const port = process.env.PORT || 3000; // Use either the PORT environment variable or port 3000

// Error handler for errors that occur when HTTP server is handling issue
function onSocketPreError(e) {
    console.log(e);
}

// Error handler for errors that occur when wss is handling issue
function onSocketPostError(e) {
    console.log(e);
}

console.log(`Attempting to run server on port ${port}`);

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
    socket.on('error', onSocketPreError);

    // perform auth
    if(!!req.headers['BadAuth']) { //TODO: replace with actual authentication
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener('error', onSocketPreError);
        wss.emit('connection', ws, req);
    });

});

wss.on('connection', (ws, req) => {
    ws.on('error', onSocketPostError);

    ws.on('message', (msg, isBinary) => {
        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN) {
                client.send(msg, { binary: isBinary });
            }
        });
    });

    ws.on('close', () => {
        console.log('Connection Closed');
    });
});