const { url, username, password, grantType } = require("./wakanow_config");
// const { getAirports } = require("./src/api_requests");
const { Wakanow } = require("./src/Wakanow");
console.log(url, username, password, grantType);
const airportsList = require("./src/data/airportsList.json");
module.exports = {
  wakanow: new Wakanow(url, username, password, grantType),
  airportsList,
};
// module.exports={}
