/*
    The function 'sendRequest()' uses the fetch API to send a GET
    request to the node.js server
*/

async function sendRequest() {
    const port = "3000";
    const url = "http://localhost:" + port;

    try {
        //Send a basic GET request
        const response = await fetch(url);
        //If the request failed, log an error
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        // Get the contents of the request and log it
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }

}