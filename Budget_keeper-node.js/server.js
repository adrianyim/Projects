require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyparser = require("body-parser");
const methodOverride = require("method-override");
// const moment = require("moment");

// ejs pages
const home = require("./js/home");
const login = require("./js/login");
const signUp = require("./js/signUp");
const updateItem = require("./js/updateItem");
const handleDelete = require("./js/handleDelete");

// queries
// const db = require("./js/queries");
const selected = require("./js/select");
const inserted = require("./js/insert");
const updated = require("./js/update");
const deleted = require("./js/delete");
const created = require("./js/create");

const app = express();

// Use server, public file
// app.use(express.static(path.join(__dirname, "stylesheets")));
app.use("/js", express.static("./js/"));
app.use("/stylesheets", express.static("./stylesheets/"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(session({
    secure: true,
    secret: "Secret?",
    saveUninitialized: false,
    resave: false
}));
app.use(methodOverride("_method"));

// Set server
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("port", (process.env.PORT || 1010));

// ejs Page
app.use("/login", login);
app.use("/home", home);
app.use("/", signUp);
app.use("/", updateItem);
app.use("/", handleDelete);

// Select
app.get("/selectItems", selected);

// Insert
app.post("/insertItems", inserted);

// Update
app.put("/updateItems", updated);

// Delete
app.delete("/deleteItems", deleted);

// Create new user
app.post("/create", created);

//Listen server
app.listen(app.get("port"), () => {
    console.log("Listening for connections on: ", app.get("port"));
});

// http://www.robertprice.co.uk/robblog/javascript_date_time_and_node_js-shtml/
// https://cordova.apache.org/docs/en/2.7.0/cordova/storage/sqlresultsetrowlist/sqlresultsetrowlist.html
// https://node-postgres.com/features/types
// https://stackabuse.com/how-to-format-dates-in-javascript/