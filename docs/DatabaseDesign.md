Database Name: ToDoBoardData
Table ToDoItems
- id: INT, primary key
- name: VARCHAR(255)
- status: BOOL
- active_time: DATETIME

Commands to set up database:
CREATE DATABASE ToDoBoardData;
USE ToDoBoardData;
CREATE TABLE ToDoItems(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    status BOOL,
    active_time DATETIME
);
INSERT INTO ToDoItems VALUES ("ERROR", false, NULL);
INSERT INTO ToDoItems VALUES ("ERROR", false, NULL);
INSERT INTO ToDoItems VALUES ("ERROR", false, NULL);
INSERT INTO ToDoItems VALUES ("ERROR", false, NULL);
INSERT INTO ToDoItems VALUES ("ERROR", false, NULL);
INSERT INTO ToDoItems VALUES ("ERROR", false, NULL);
INSERT INTO ToDoItems VALUES ("ERROR", false, NULL);