const dotenv = require("dotenv");
dotenv.config();
const config = {
  url: process.env.WAKANOW_URL,
  grantType: process.env.WAKANOW_GRANT_TYPE,
  username: process.env.WAKANOW_USERNAME,
  password: process.env.WAKANOW_PASSWORD,
};
module.exports = { ...config };
