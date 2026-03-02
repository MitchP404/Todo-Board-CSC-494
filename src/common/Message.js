/*
    The types of messages that can be sent over a websocket message in this structure
*/

// Types for messages sent from the server
export const ServerMessages = Object.freeze({
    SENDALL: 1, //Send all items, body contains an array of ToDoItems with 'id', 'status', and 'name'
    UPDATE_ITEM: 2, //Update a single item's status, body contains a ToDoItem with 'id' and 'status'

    //Errors
    ERR_SETUP_RETRIEVAL: 101 //Error getting all items for initial setup
});

// Types for messages sent from the client
export const ClientMessages = Object.freeze({
    UPDATE: 1, //Update a certain ToDoItem. body contains the item 'id' and 'status'
    CREATE: 2, //Create a ToDo item, body contains the item's 'name'
    DELETE: 3  //Delete a ToDo item, body contains the item's 'id'
});

// The Messages themselves
export class Message {
    constructor(ws, type, body, callback) {
        this.ws = ws;
        this.type = type;
        this.body = body;
        this.callback = callback;
    }

    send() {
        this.ws.send(JSON.stringify({
            type: this.type,
            body: this.body
        }), {binary: false}, this.callback);
    }
}