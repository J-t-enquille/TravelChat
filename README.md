# Travel Chat - digital structured message communication

## Goals
1. Designing a kernel schema
2. Developing extension sub-schemas
3. Implement a client capable of managing these structured messages supporting the kernel schema and extensions via a system of plugins.

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
2. **Start the clients**

In another terminal :
```bash
cd client
npm run dev
```
Yet another terminal:
```bash
cd client
npm run dev
```
By default, the two clients will be on port 5173 and 5174.
