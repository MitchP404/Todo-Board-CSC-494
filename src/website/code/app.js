
let ws; //Our WebSocket connection to the server

// A single item on the board
class BoardItem {

    // id: The id of this item. Must be value 1-7. Also serves as the array index + 1
    // name: The name of the item
    // status: Whether or not the item is completed.TRUE if yes. 
    constructor(id, name, complete) {
        this.id = id;
        this.name = name;
        this.complete = complete;
    }

    // Create HTML content for this object
    toHTML = function() {
        return `<h2>#${this.id}: ${this.name}</h2>
        <label for="done${this.id}">Done</label>
        <input type="radio" id=done${this.id} name="complete${this.id}" value="true">
        
        <label for="notdone${this.id}">Not Done</label>
        <input type="radio" id=notdone${this.id} name="complete${this.id}" value="false">
        `
    }

    // Update whether or not this item is complete
    updateStatus(complete) {
        this.complete = complete;
        console.log(`Item ${this.id} status: ${complete}`);
    }

    // Add event listeners to the radio buttons
    createListeners(){
        console.log(`Adding listeners to ${this.id}`);
        let item = document.getElementById(`done${this.id}`);
        console.log(item);
        item.addEventListener("change", () => {
            this.updateStatus(true);
        });
        
        document.getElementById(`notdone${this.id}`).addEventListener("change", () => {
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
    ws = new WebSocket('ws://localhost:3000');

    //Make the board items
    boardsHTML = document.getElementById('boards');
    const itemCount = 3;
    
    //An array contianing the items on the board
    items = Array(itemCount);

    for(i = 0; i < itemCount; i++) {
        //Initialize each board item
        //TODO: This needs to come from the web socket server
        items[i] = new BoardItem(i+1, "Name", false);
        boardsHTML.innerHTML += `<div id = slot${i}>${items[i].toHTML()}</div>`;
    }

    for(i = 0; i < itemCount; i++) {
        items[i].createListeners();
    }

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
    });

    document.getElementById("loadMsg").innerHTML = "";
});