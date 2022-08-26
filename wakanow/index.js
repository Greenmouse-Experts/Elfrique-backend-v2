const { url, username, password, grantType } = require("./wakanow_config");
// const { getAirports } = require("./src/api_requests");
const { Wakanow } = require("./src/Wakanow");
console.log(url, username, password, grantType);
module.exports = new Wakanow(url, username, password, grantType);
exports.airportsList = require("./src/data/airportsList.json");
// module.exports={}
