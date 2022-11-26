require("dotenv").config();
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const PORT = process.env.PORT;

app.use(function (req, res, next) {
    res.setHeader('X-Frame-Options', 'sameorigin');
    next();
});
app.use(function (req, res, next) {
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self';");
    next();
});
app.use(express.static('public'));
app.use(session({
    secret: 'my-secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'strict' //👈 new code
    }
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"))

const dbo = require("./db/conn")

app.use(bodyParser.json());

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.use(morgan('dev'));


app.listen(PORT, () => {
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });
    console.log(`server is listening  on ${PORT}`);
});

module.exports = app;