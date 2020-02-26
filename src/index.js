const fs = require("fs"),
    http = require("http"),
    path = require("path"),
    methods = require("methods"),
    express = require("express"),
    bodyParser = require("body-parser"),
    session = require("express-session"),
    cors = require("cors"),
    passport = require("passport"),
    errorhandler = require("errorhandler"),
    mongoose = require("mongoose");

const isProduction = process.env.NODE_ENV === "production";


const app = express();

app.use(cors());


app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("method-override")());
app.use(express.static(__dirname + "/public"));

app.use(
    session({
        secret: "authorshaven",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
);

if (!isProduction) {
    app.use(errorhandler());
}

if (isProduction) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect("mongodb://localhost/conduit");
    mongoose.set("debug", true);
}

require("./models/User");



app.get('/', (req, res) => {
    res.status(200).json({message:'welcome'});
});

app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

if (!isProduction) {
    app.use(function(err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err
            }
        });
    });
}


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
            error: {}
        }
    });
});


const server = app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port " + server.address().port);
});

module.exports = server;
