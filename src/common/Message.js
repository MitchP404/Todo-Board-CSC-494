/*
    The types of messages that can be sent over a websocket message in this structure
*/

// Types for messages sent from the server
export const ServerMessages = Object.freeze({
    SENDALL: 1, //Send all items, body contains an array of ToDoItems with 'id', 'status', and 'name'
    UPDATE: 2, //Update a single item's status, body contains a ToDoItem with 'id' and 'status'

    //Errors
    ERR_SETUP_RETRIEVAL: 101, //Error getting all items for initial setup
    ERR_UPDATE_RETRIEVAL: 102 //Error updating an item
});

// Types for messages sent from the client
export const ClientMessages = Object.freeze({
    UPDATE: 1, //Update a certain ToDoItem. body contains the item 'id' and 'status'
    CREATE: 2, //Create a ToDo item, body contains the item's 'name'
    DELETE: 3  //Delete a ToDo item, body contains the item's 'id'
});

// Send a message. Returns a promise with resolve() and reject(error,msg)
export function sendMessage(ws, type, body){
    return new Promise((resolve, reject) => {
        let msg = JSON.stringify({
            type: type,
            body: body
        });
        //console.log(msg);
        ws.send(msg, {binary: false}, (error) => {
            if(!!error) {
                reject(error, m);
            } else {
                resolve();
            }
        });
    });
}

// Send a message to all ready sockets. Returns a promise with resolve() called for each successful send and reject(error,msg) called for each failed send
export function sendMessageAll(wss, type, body) {
    return new Promise((resolve, reject) => {
        let msg = JSON.stringify({
            type: type,
            body: body
        });
        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN) {
                sendMessage(client, type, body).then(resolve, reject);
            }
        });
    })
}