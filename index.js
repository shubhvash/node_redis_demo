"use strict";
const express = require("express");  
const fetch = require("node-fetch");
const redis = require("redis");
const PORT = process.env.PORT || 4000;
const PORT_REDIS = process.env.PORT || 6379;
const app = express();
const redisClient = redis.createClient(PORT_REDIS);
const set = (key, value) => {
   redisClient.set(key, JSON.stringify(value));
}
const get = (req, res, next) => {
	let key = req.route.path;    redisClient.get(key, (error, data) => {
      if (error) res.status(400).send(err);
      if (data !== null) res.status(200).send(JSON.parse(data));
      else next();
 	});
}
app.get("/spacex/launches", get, (req, res) => {
  fetch("https://api.spacexdata.com/v3/launches/latest")
    .then(res => res.json())
    .then(json => {
    	set(req.route.path, json);
    	res.status(200).send(json);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(error);
    });
});
app.listen(PORT, () => console.log(`Server up and running on ${PORT}`));

/*  
    //Code without redis implemented 
"use strict";
const express = require("express");  
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 4000;
app.get("/spacex/launches", (req, res) => {  
  fetch("https://api.spacexdata.com/v3/launches/latest")
    .then(res => res.json())
    .then(json => { res.status(200).send(json) })
    .catch(error => {
      console.error(error);
      res.status(400).send(error);
    });
});
app.listen(PORT, () => console.log(`Server up and running on ${PORT}`)); 
*/