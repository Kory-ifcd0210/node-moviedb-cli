const dotenv = require('dotenv');
dotenv.config();//{path:"__dirname/./../src/.env"}
module.exports = {
  API_KEY: process.env.API_KEY,
};
