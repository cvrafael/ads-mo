const express = require("express");
const routes = require("./routes.js");
require("dotenv").config
const cors = require('cors');
const { testConnection } = require("./config/database");

const app = express();

require("./config/database");

app.use(cors());
// app.use(express.static('public/uploads'))
app.use(express.json());

app.use(routes);

app.listen(3030, () => {
    console.log("Rodando na porta: 3030")
    testConnection();
}
)