import { ServerMessages, ClientMessages, sendMessage } from "../common/Message.js"

var ws; //Our WebSocket connection to the server

// A single item on the board
class BoardItem {

    // id: The sql id of this item.
    // name: The name of the item
    // status: Whether or not the item is completed.TRUE if yes. 
    // num: The order number of this item on this webpage
    constructor(id, name, complete, num) {
        this.id = id;
        this.name = name;
        this.complete = complete;
        this.num = num;
    }

    // Create HTML content for this object
    toHTML = function() {
        return `<div id = item${this.id}>
        <h2>#${this.num}: ${this.name}</h2>
        <label for="done${this.id}">Done</label>
        <input type="radio" id=done${this.id} name="complete${this.id}" value="true">
        
        <label for="notdone${this.id}">Not Done</label>
        <input type="radio" id=notdone${this.id} name="complete${this.id}" value="false">
        </div>
        `
    }

    // Attempt to change whether or not this item is complete
    changeStatus(complete) {
        const b = {id: this.id, status: complete};
        console.log(`Updating item ${this.id} status: ${complete}. Sending message with body: ${JSON.stringify(b)}`);
        sendMessage(ws, ClientMessages.UPDATE, b).then(
            //Resolve
            () => {
                console.log('Update sent');
            },
            //Reject
            (error,msg) => {
                console.error('Could not send update: ' + msg + '\n' + error.stack);
            }
        );
    }

    // Update this items status after having been told to do so by the server
    updateStatus(status) {
        this.complete = status;
        if(status == true) {
            document.getElementById(`done${this.id}`).checked = true;
        } else {
            document.getElementById(`notdone${this.id}`).checked = true;
        }
    }

    // Setup the buttons on a newly created BoardItem with its HTML already in the webpage
    setupButtons(){

        let doneButton = document.getElementById(`done${this.id}`);
        let notDoneButton = document.getElementById(`notdone${this.id}`)

        // Set the buttons based on whether the task is done
        if(this.complete) {
            doneButton.checked = true;
        } else {
            notDoneButton.checked = true;
        }

        // Add event listeners to the buttons
        doneButton.addEventListener("change", () => {
            this.changeStatus(true);
        });
        
        notDoneButton.addEventListener("change", () => {
            this.changeStatus(false);
        });
    }

    //Convert the contents of this item to a JSON string
    toString() {
        return JSON.stringify(this);
    }
};

// End the connection to the web socket server
function closeConnection() {
    if(!!ws) {
        ws.close();
    }
}

// Make a new item and send it to the server
function createNew() {
    let name = prompt("Name of the new task: ");
    sendMessage(ws, ClientMessages.CREATE, {name: name}).then(
        //Resolve
        () => {
            console.log('Creation request sent: ' + name);
        },
        //Reject
        (error,msg) => {
            console.error('Could not send create request: ' + msg + '\n' + error.stack);
        }
    );
}

// Send a request to the server to delete a ToDoItem
function deleteItem(id) {
    sendMessage(ws, ClientMessages.DELETE, {id: id}).then(
        //Resolve
        () => {
            console.log('Delete request sent: ' + id);
        },
        //Reject
        (error,msg) => {
            console.error('Could not send delete request: ' + msg + '\n' + error.stack);
        }
    );
}

document.addEventListener('DOMContentLoaded', function() {
    closeConnection();

    //Attempt to create the connection
    ws = new WebSocket('ws://localhost:3000');

    //An array containing the items on the board
    let items = [];

    ws.addEventListener('error', () => {
        console.log('WebSocket error');
    });

    ws.addEventListener('open', () => {
        console.log('WebSocket connection established');
    });

    ws.addEventListener('close', () => {
        console.log('WebSocket connection closed');
    });

    ws.addEventListener('message', (msg) => {
        console.log(`Received message: ${msg.data}`);
        let m = JSON.parse(msg.data); //The contents of the message
        let boardsHTML = document.getElementById('boards'); //The item on the page where the to do items are located
        switch(m.type){
            case ServerMessages.SENDALL:
                // Message contains all active items.
                // Reset the items array to be these
                items = [];
                for(let i = 0; i < m.body.length; i++) {
                    items.push(new BoardItem(m.body[i].id, m.body[i].name, m.body[i].status, i+1));
                }
                
                //Create the site based on the contents of the items array
                boardsHTML.innerHTML = '';
                for(let i = 0; i < items.length; i++) {
                    //Initialize each board item
                    boardsHTML.innerHTML += `<div id = item${items[i].id}>${items[i].toHTML()}</div>`;
                }

                //Add all event handlers for buttons
                for(let i = 0; i < items.length; i++) {
                    items[i].setupButtons();
                }

                document.getElementById("loadMsg").innerHTML = "";
                break;
            case ServerMessages.UPDATE:
                // Message contains the id and status for updating a To Do list item
                for (let i = 0; i < items.length; i++) {
                    if(items[i].id == m.body.id) {
                        items[i].updateStatus(m.body.status);
                    }
                }
                break;
            //Errors
            case ServerMessages.ERR_SETUP_RETRIEVAL:
                // Initial setup failed
                boardsHTML.innerHTML = '<p class = error>An internal error has prevented retrieving the To-Do list items.</p>';
                document.getElementById("loadMsg").innerHTML = "";
                break;
            case ServerMessages.ERR_UPDATE_RETRIEVAL:
                // Failed to update item
                boardsHTML.innerHTML = '<p class = error>An internal error has prevented updating the To-Do list item.</p>';
                break;
            default:
                console.error("UNRECOGNIZED WEBSOCKET MESSAGE TYPE");
                break;

        }
    });
});