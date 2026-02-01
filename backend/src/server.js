const express = require("express");
const routes = require("./routes.js");
const path = require('path');
require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser')

const app = express();

const PORT = process.env.PORT;
const HOST = '0.0.0.0';

app.use(cors({
    origin: 'http://localhost:5174', // exato do frontend
    credentials: true
}))

require("../config/config.js");

// app.use(express.static('public/uploads'))
app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(PORT, HOST, () => {
    console.log(`Serving on HOST ${HOST} and port: ${PORT}`);
}
)