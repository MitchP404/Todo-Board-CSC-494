# The Dockerfile that the server container is built from

FROM node:latest

WORKDIR /app

# package.json controls certain information about the node.js file
# Most important here is what dependencies are required
COPY package.json package.json

# Install all depndencies from package.json
RUN npm install

# The rest of the code should be imported with a volume
# Move the code into the container
# COPY /code ./code

# Run the server
CMD [ "npm", "start" ]