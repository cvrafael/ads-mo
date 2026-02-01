require('dotenv').config();
console.log('teste',process.env.USERNAME)
module.exports = 
  {
    "development": 
    {
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.HOST,
    "dialect": process.env.DIALECT,
    },
    "test": 
    {
     "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.HOST,
    "dialect": process.env.DIALECT,
    "logging": true,
    },
    "production": 
    {
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.HOST,
    "dialect": process.env.DIALECT,
    "logging": false,
    },
  }
