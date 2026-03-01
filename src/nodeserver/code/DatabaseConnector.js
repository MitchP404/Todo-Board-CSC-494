/*
    A class representing a connection to the database
*/

const mysql = require('mysql2')

class DatabaseConnetor {
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
        this.connection.query("UPDATE ToDoItems SET status = ? WHERE id = ?;", [status,id], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    }

    // Get the number of active To-Do items
    // Returns a promise with resolve(results) and reject(error)
    itemCount() {
        this.connection.query("SELECT COUNT(active_time) FROM ToDoItems;", (error, results) => {
            if(error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    }

    // Make a new To-Do item by activating one of the slots
    // Returns a promise with resolve(results) and reject(error, isCapacity)
    // isCapacity is true if the error was caused by not having room
    newItem(name) {
        this.connection.query('UPDATE ToDoItems SET name = ?, active_time = NOW() WHERE id = (SELECT min_id FROM (SELECT MIN(id) AS min_id FROM ToDoItems WHERE active_time IS NULL) AS derived_table);', [name], (error, results) => {
            if(error) {
                reject(error, false);
                return;
            }
            if(results.length == 0) {
                reject(error, true);
                return;
            }
            resolve(results);
        });
    }

    // Remove a To-Do item by deactivating one of the slots
    // Returns a promise with resolve(results) and reject(error)
    removeItem(id) {
        this.connection.query('UPDATE ToDoItems SET name="ERROR", active_time = NULL, status = 0 WHERE id = ?;', [id], (error, results) => {
            if(error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    }

    // Grab all To-Do items, in the order that they were created
    // Returns a promise with resolve(results) and reject(error)
    getItems() {
        this.connection.query('SELECT id, name, status FROM ToDoItems WHERE active_time IS NOT NULL ORDER BY active_time ASC;', (error, results) => {
            if(error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    }

    //Disconnect from the database
    disconnect() {
        this.connection.end();
    }
}

module.exports = DatabaseConnector;