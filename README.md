# Get Bitcoin Historical Data from Bitmex API

## Default config

Get Bitcoin (XBTUSD) data with a bin size of 1m. Bitmex API limits the requests to 60 per minute.

## How to use it

- Create .env file from .env.sample and put your Bitmex API Key and your database credentials
- In /db/index.js specify the database environment in the constant `DB_ENV`
- In /index.js you can change INITIAL_START_TIME, SYMBOL, BIN_SIZE_MIN and more configurations
- Run `npm install`
- Run `npm start`

## API Docs

https://www.bitmex.com/api/explorer/#!/Quote/Quote_getBucketed
