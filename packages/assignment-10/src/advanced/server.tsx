// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";
import express from "express";
import ReactDOMServer from "react-dom/server";
import { App } from "./App.tsx";
import NodeCache from "node-cache";

const pageCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const app = express();
const port = 3333;

app.get("*", (req, res) => {
  const id = req.url;
  const cacheKey = `cache_${id}`;

  const cachedPage = pageCache.get(cacheKey);

  if (cachedPage) {
    return res.send(cachedPage);
  }

  const app = ReactDOMServer.renderToString(<App url={req.url} />);

  pageCache.set(cacheKey, app);
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple SSR</title>
    </head>
    <body>
      <div id="root">${app}</div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
