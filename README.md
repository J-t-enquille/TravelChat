# Travel Chat - digital structured message communication

## Goals

1. Designing a kernel schema
2. Developing extension sub-schemas
3. Implement a client capable of managing these structured messages supporting the kernel schema and extensions via a
   system of plugins.

Communication is simulated locally.

## Technologies used

- **Frontend** : React
- **Backend** : Express, Socket.IO
- **Schemas** : JSON Schema
- **Libraries** : `ajv` for schema validation, `rjsf` for rendering forms based on JSON schemas

## Prerequisites

- Node.js
- Git

## Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/J-t-enquille/TravelChat.git
    ```
2. **Install server dependencies**
    ```bash
    cd server
    npm install
    ```
3. **Installing client dependencies**

   In another terminal :
    ```bash
    cd client
    npm install
    ```

## Run the project

1. **Start the server**
    ```bash
    cd server
    npm run dev
    ```
2. **Start the client dev server**

   In another terminal :

    ```bash
    cd client
    npm run dev
    ```
   > Open multiple browser tabs to simulate multiple clients. By default, the client development server will be on port `5173`.
## Build the project

1. **Use the `build.sh` script**
    ```bash
    ./build.sh
    ```
   > This script will build the client and server for production, the output will be in the `dist` folder.

2. **Run the production build**

   After building, you can run the production server with:
    ```bash
    cd dist
    NODE_ENV=production node bundle.js
    ```
    > The production server will be available on port `5000` by default. It will serve the static files from the `client/dist` directory on port `5000` too.
