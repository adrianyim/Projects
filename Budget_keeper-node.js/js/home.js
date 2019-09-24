// const select = require("../js/select");
const express = require("express");

// const connectionString = process.env.DATABASE_URL;
const connectionString = process.env.LOCAL_DB_URL;

const {Pool} = require("pg");
const pool = new Pool({connectionString: connectionString});

const app = express();

app.get("/", (req, res, next) => {
    console.log("In home page");
    res.render("home", {
        username: req.session.username
    });
    next();
});

app.post("/", (req, res, callback) => {
    console.log("In the home page");
    // Retrieve data from client side
    let username = req.body.username;
    let password = req.body.password;
    // app.locals.error = false;

    // let form = document.getElementById("myForm")
    // let isValid = form.checkValidity();

    console.log("Recived data:\nUsername: " + username + "\nPassword: " + password);

    if (username == "" || password == "") {
        // console.log("\nUsername or password is empty!\n");
        // let error = "Username or password is incorrected!!";
        // res.redirect("login");
    } else {
        let sql = "SELECT password FROM users WHERE user_name = $1";
        let select_params = [username];

        pool.query(sql, select_params, (err, result) => {
            if (err) {
                console.log("Error in query, ", err);
                callback(err, null);
            }

            // Check username
            if (result.rows == "") {
                console.log("\nUsername is not matched!\n");

                // ...............NEED TO FIX ..............
                app.locals.error = "Username is not matched!";
                // ...............NEED TO FIX ..............
                
                res.redirect("login");
            } else if (result) {
                console.log("The password from DB: ", result.rows[0].password);
                let passwordDB = result.rows[0].password;
                
                // Check password
                if (password == passwordDB) {
                    req.session.username = username;

                    // Direct to home page and pass the session variable
                    res.render("home", {
                        username: username
                    });
                } else {
                    console.log("\nPassword is not match!\n");
                    res.redirect("login");
                }
            }
        });
    }
});

module.exports = app ;