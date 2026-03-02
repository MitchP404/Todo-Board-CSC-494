import { ServerMessages, ClientMessages, Message } from "../common/Message.js"

let ws; //Our WebSocket connection to the server

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

    // Update whether or not this item is complete
    updateStatus(complete) {
        console.log(`Updating item ${this.id} status: ${complete}. Sending message...`);
        m = new Message(ws, ServerMessages.SENDALL, results, (error) => {
                if(!!error) {
                    console.error(error);
                } else {
                    console.log("Update message sent");
                }
        });
        m.send();
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
            this.updateStatus(true);
        });
        
        notDoneButton.addEventListener("change", () => {
            this.updateStatus(false);
        });
    }

    //Convert the contents of this item to a JSON string
    toString() {
        return JSON.stringify(this);
    }
};

function closeConnection() {
    if(!!ws) {
        ws.close();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    closeConnection();

    //Attempt to create the connection
    var ws = new WebSocket('ws://localhost:3000');
    
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
            //Errors
            case ServerMessages.ERR_SETUP_RETRIEVAL:
                // Initial setup failed
                boardsHTML.innerHTML = '<p class = setup_error>An internal error has prevented retrieving the To-Do list items.</p>';
                document.getElementById("loadMsg").innerHTML = "";
                break;
                
            default:
                console.error("UNRECOGNIZED WEBSOCKET MESSAGE TYPE");
                break;

        }
    });
});