Database Name: ToDoBoardData
Table ToDoItems
- id: INT, primary key
- name: VARCHAR(255)
- status: BOOL

Commands to set up database:
CREATE DATABASE ToDoBoardData;
USE ToDoBoardData;
CREATE TABLE ToDoItems(
    id int,
    name varchar(255),
    status bool,
    active bool
);
INSERT INTO ToDoItems VALUES (1, "ERROR", false, false);
INSERT INTO ToDoItems VALUES (2, "ERROR", false, false);
INSERT INTO ToDoItems VALUES (3, "ERROR", false, false);
INSERT INTO ToDoItems VALUES (4, "ERROR", false, false);
INSERT INTO ToDoItems VALUES (5, "ERROR", false, false);
INSERT INTO ToDoItems VALUES (6, "ERROR", false, false);
INSERT INTO ToDoItems VALUES (7, "ERROR", false, false);