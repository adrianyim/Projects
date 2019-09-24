const app = require("express").Router();

app.get("/signUp", (req, res, next) => {
    console.log("In signUp page");
    res.render("signUp");
    next();
});

module.exports = app;