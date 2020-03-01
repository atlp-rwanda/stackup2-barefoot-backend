import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import SwaggerSpecs from '../public/api-docs/swagger.json';

const isProduction = process.env.NODE_ENV === "production";


const app = express();
const port = process.env.PORT || 3000;

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

app.use(express.Router());
router.use('/public/api-docs', serve, setup(SwaggerSpecs));


const server = app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port " + server.address().port);
});

module.exports = server;
