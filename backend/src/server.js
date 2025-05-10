const express = require("express");
const routes = require("./routes.js");
const path = require('path');

require("dotenv").config;
const cors = require('cors');
const { testConnection } = require("./config/database");

const app = express();

const PORT = process.env.PORT;
const HOST = '0.0.0.0';

require("./config/database");

app.use(cors());
// app.use(express.static('public/uploads'))
app.use(express.json());

app.use(routes);
app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(PORT, HOST, () => {
    console.log(`Serving on HOST ${HOST} and port: ${PORT}`);
    testConnection();
}
)