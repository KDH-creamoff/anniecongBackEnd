const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: 'root',
    password: process.env.DEV_DB_PASSWORD,
    database: 'inventory_development',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.DEV_DB_PASSWORD,
    database: 'inventory_test',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: process.env.PRODUCTION_DB_PASSWORD,
    database: 'inventory_production',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
  },
};
