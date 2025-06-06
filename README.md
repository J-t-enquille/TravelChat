# Travel Chat - digital structured message communication

## Goals

1. Designing a kernel schema
2. Developing extension sub-schemas
3. Implement a client capable of managing these structured messages supporting the kernel schema and extensions via a
   system of plugins.

Communication is simulated locally.

## How it works
- **Sending a simple message:** the user can enter a free text message and send it.
- **Sending a structured message:** the user can select a plugin (and therefore a schema) and enter the question. The message sent contains the text of the question and the associated JSON schema. The recipient receives the message and can respond (Answer tab) using a form generated from the schema.
- **Receive a structured response:** the response is formatted according to the JSON schema associated with the message.

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

## Add your own schema as a plugin
1. Create a new JSON schema

In the `/schemas` folder, add a new .json file containing your schema.
Example :
```json
{
  "$id": "myCustomSchema.json",
  "title": "My Custom Schema",
  "type": "object",
  "properties": {
    "question": {
      "type": "string",
      "title": "Your Question"
    },
    "details": {
      "type": "string",
      "title": "Additional Details"
    }
  },
  "required": ["question"]
}
```
2. Declare the schema in `schemas/index.ts`
```javascript
import myCustomSchema from './myCustomSchema.json';
export const schemas = [..., myCustomSchema];
```
And in the `selectIcon()` function, you can add a custom icon to the plugin (otherwise the default beer icon)
```javascript
import { BiCustomize } from "react-icons/bi";
export const selectIcon = (name?: string): IconType => {
    ...
    if (name?.replaceAll(" ", "") === "MyCustomSchema") {
        return BiCustomize;
    }
    return FaBeer;
};
```
3. Add the treatment to `FormDialog.tsx`

Add an `isCustomSchema` variable to check whether the schema is customised
```javascript
const isCustomSchema = schema.$id?.includes("myCustomSchema.json");
```
Puis dans le `return()`:
```javascript
isCustomSchema && ask ? (
    <ExtensionForm
        onClose={onClose}
        schema={schema}
        initialQuestionText={"Please enter your ..."}
    />
) :
```
It is possible to change `<ExtensionForm />` by another component if you want a different behaviour for your custom schema.

4. Add response management to `Answer.tsx`
```javascript
const isCustomSchema = schema.$id?.includes("myCustomSchema.json");
const answeredSchema =
    ...
    : isMyCustomSchema
        ? "My Custom Extension"
        : "Question";
```

5. In `Chat.tsx` add the response treatment
```javascript
const isCustomSchema = schema.$id?.includes("myCustomSchema.json");
    ...
    else if (isCustomSchema) {
        const data = JSON.parse(message.text);
        const text = `Answer to ${schema.title}: Question: ${data.question}, Details: ${data.details}`;
        const msg = { ...message, text };
        setMessages((prev) => [...prev, msg]);
    }
```
