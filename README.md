# IoTBay

A project of IT product e-commerce web application.

## Project Tech Stack

- React, Javascript
- NodeJS, Express, Sqlite

## Installation

1. Clone the master branch of the repository
2. Install [NodeJS](https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi)
3. Open a terminal/command prompt in the main folder directory
4. Enter the command **`npm install`**

## Initialize Database

1. Add config file **`config.env`** to **`Project/Server/`**

```bash title="IoTBay/Server/config.env"
# Enter your own secret string to encrypt & decrypt JWT
JWT_SECRET=Your_Secret_String
# The following option sets valid dates for new JWT token
JWT_EXPIRES_IN=14d
JWT_COOKIE_EXPIRES_IN=14
```

2. Run sql queries in file `queries.sql` to init Database
   - The preset account might not working due to different SECRET string, if its not working, use register to create a new account

## Running

1. Open a terminal/command prompt in the main folder directory
2. Enter the command **`npm run server`** to start server
3. Open another terminal/command prompt in the main folder directory
4. Enter the command **`npm run frontend`** to start frontend
   - Or Enter the command `npm run all` to run both server and frontend same time
5. Open a web browser (recommended Google Chrome) and navigate to http://localhost:5173/
