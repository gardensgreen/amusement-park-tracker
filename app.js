const express = require("express");

const morgan = require("morgan");
const { environment } = require("./config");

const routes = require("./routes");

const app = express();

app.set("view engine", "pug");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(routes);

//404 Catch All
app.use((req, res, next) => {
    const err = new Error("Page Not Found");
    err.status = 404;
    next(err);
});

//Error Middleware
app.use((err, req, res, next) => {
    if (environment == "production") {
        //TODO: Log error to database
    } else {
        // console.error(err);
    }
    next(err);
});

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404);
        res.render("page-not-found", { title: err.message });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = environment === "production";
    res.render("error", {
        title: "Server Error",
        message: isProduction ? null : err.message,
        stack: isProduction ? null : err.stack,
    });
});

module.exports = app;
