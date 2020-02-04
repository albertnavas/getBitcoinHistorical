require("dotenv/config");
const crypto = require("crypto");
const fetch = require("node-fetch");
const PromiseThrottle = require("promise-throttle");

const { dbMigrations, getLast, insertBatch } = require("./db");

const BASE_URL = "https://www.bitmex.com";
const PATH = "/api/v1/trade/bucketed";
const BITMEX_ID = process.env.ID;
const BITMEX_SECRET = process.env.SECRET;

const SYMBOL = "XBTUSD";
const COUNT = 1000;
const BIN_SIZE_MIN = 1;
const BIN_SIZE = `${BIN_SIZE_MIN}m`;
const REVERSE = false;
const PARTIAL = false;
const INITIAL_START_TIME = "2015-09-25T12:01:00.000Z";

const promiseThrottle = new PromiseThrottle({
  requestsPerSecond: 1,
  promiseImplementation: Promise
});

const fetchRequest = async startTime => {
  const METHOD = "GET";
  const expires = Math.round(new Date().getTime() / 1000) + 60; // 1m
  const query = `?startTime=${startTime}&binSize=${BIN_SIZE}&partial=${PARTIAL}&symbol=${SYMBOL}&count=${COUNT}&reverse=${REVERSE}`;

  const signature = crypto
    .createHmac("sha256", BITMEX_SECRET)
    .update(METHOD + PATH + query + expires)
    .digest("hex");

  const headers = {
    "content-type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "api-expires": expires,
    "api-key": BITMEX_ID,
    "api-signature": signature
  };

  return await fetch(`${BASE_URL}${PATH}${query}`, { method: METHOD, headers });
};

const getStartTime = async () => {
  const lastEntry = await getLast();

  let startTime;
  if (!lastEntry) {
    startTime = INITIAL_START_TIME;
  } else {
    startTime = lastEntry.timestamp;
    startTime.setMinutes(startTime.getMinutes() + BIN_SIZE_MIN);
    startTime = new Date(startTime).toISOString();
  }

  return startTime;
};

const main = async () => {
  try {
    await dbMigrations();

    let startTime = await getStartTime();

    let data = ["init"];
    while (data[0]) {
      const request = await promiseThrottle.add(
        fetchRequest.bind(this, startTime)
      );

      data = await request.json();

      await insertBatch(data);

      startTime = await getStartTime();
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  process.exit(0);
};

main();
