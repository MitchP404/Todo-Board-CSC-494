# To-Do Board CSC 494

## Project Description
This project is meant to produce a To-Do list that can be updated on the go via a web application and is satisfying to use to motivate the completion of tasks. Originally, I was going to make a physical board as well to make it easier for multiple people to check, but this became unnecessary later into the semester.

## Problem Domain and Motivation
I tend to procrastinate, so I want to have something that I can check off when I get something done. I also want to be able to access this on multiple devices so I can pull it up quickly no matter what I am using. This project is meant to produce a To-Do list that can be updated from any device and is satisfying to use to motivate the completion of tasks.

## How to use
To test the system for yourself, you must have Docker engine and compose installed. The easiest way to do so is to just install Docker desktop. Once that is done, navigate to the folder this project is in, open a command terminal, and type "docker-compose up -d --build". Finally, go to 'localhost' in any web browser. To shut it down, type "docker-compose down" in the same command terminal.

## Features and Requirements
1. The list will keep track of multiple To-Do tasks
2. The list will connect to a web application that allows the user to update it on the go
3. The list will produce some sort of 'satisfying' event when the task is complete
4. The list will be accessible from a physical device that can be propped up on a desk or stuck to a fridge

## Test cases
1. Is the list able to track multiple To-Do tasks?
    - Can a user create an item?
    - Can a user delete an item?
    - Can a user edit an item?
    - Can a user mark an item as complete?
    - Does updating the list in any way also update other instances?
2. Does the list feel satisfying to use? Do events take place that makes completing a task feel more fun to me?

## Team members
Me :D

## Links
Code: [/src](src)

Tests: [/tests](tests)

Documentation: [/docs](docs)

Presentations: [/docs/Presentations](docs/Presentations)
- PPP: [PPP.md](docs/Presentations/PPP/PPP.md), [PPP.pdf](docs/Presentations/PPP/PPP.pdf)
- S1P: [S1P.md](docs/Presentations/S1P/S1P.md), [S1P.pdf](docs/Presentations/S1P/S1P.pdf)