/*
    A class representing a connection to the database
*/

const mysql = require('mysql2')

class DatabaseConnector {
    constructor(ipAddress, port, user, password, databaseName) {
        this.ipAddress = ipAddress;
        this.port = port;
        this.user = user;
        this.password = password;
        this.databaseName = databaseName;
    }

    // Connect to the database using information from the constructor
    // Returns a promise with resolve() and reject(error)
    connect() {
        this.connection = mysql.createConnection({
            host: this.ipAddress,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.databaseName
        });

        return new Promise((resolve, reject) => {
            this.connection.connect((error) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

    // Update the status of a To-Do item
    // Returns a promise with resolve(results) and reject(error)
    updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE ToDoItems SET status = ? WHERE id = ?;", [status,id], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    // Get the number of active To-Do items
    // Returns a promise with resolve(results) and reject(error)
    itemCount() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT COUNT(active_time) AS count FROM ToDoItems;", (error, results) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    // Get the number of inactive To-Do items (open slots)
    // Returns a promise with resolve(results) and reject(error)
    itemSpace() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT COUNT(active_time) AS count FROM ToDoItems WHERE active_time IS NULL;", (error, results) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    //Create a new item by adding a new row to the table
    makeSpace(name) {
        console.log('No space available for new item. Making a new record.');
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO ToDoItems (name, status, active_time) VALUES (?, false, NOW());", [name], (error, results) => {
                if(!!error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }

    //Create a new item by overwritting a deleted one
    fillSpace(name) {
        console.log('Space available for new item. Changing inactive record.');
        return new Promise((resolve, reject) => {
            this.connection.query('UPDATE ToDoItems SET name = ?, active_time = NOW() WHERE id = (SELECT min_id FROM (SELECT MIN(id) AS min_id FROM ToDoItems WHERE active_time IS NULL) AS derived_table);', [name], (error, results) => {
                if(!!error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }

    // Make a new To-Do item by activating one of the slots
    // Returns a promise with resolve(results) and reject(error)
    newItem(name) {
        return this.itemSpace().then(
            (results) => {
                if (results[0].count === 0) {
                    return this.makeSpace(name);
                } else {
                    return this.fillSpace(name);
                }
            }
        );
    }

    // Remove a To-Do item by deactivating one of the slots
    // Returns a promise with resolve(results) and reject(error)
    removeItem(id) {
        return new Promise((resolve, reject) => {
            this.connection.query('UPDATE ToDoItems SET name="ERROR", active_time = NULL, status = 0 WHERE id = ?;', [id], (error, results) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    // Grab all To-Do items, in the order that they were created
    // Returns a promise with resolve(results) and reject(error)
    getItems() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT id, name, status FROM ToDoItems WHERE active_time IS NOT NULL ORDER BY active_time ASC;', (error, results) => {
                if(error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }

    //Disconnect from the database
    disconnect() {
        this.connection.end();
    }
}

module.exports = DatabaseConnector;