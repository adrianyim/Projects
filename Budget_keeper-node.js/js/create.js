const {Pool} = require("pg");

// const connectionString = process.env.DATABASE_URL;
const connectionString = process.env.LOCAL_DB_URL;

// const client = new pg.Client(connectionString);
const pool = new Pool({connectionString: connectionString});

function insertNewUser (req, res) {
    console.log("In insertNewUser function");  

    // Retrieve data from client side
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;
    let gender = req.body.gender;

    console.log("The retrieve data are: \nUsername: " + username + "\nPassword: " + password + "\nRepassword: " + repassword + "\nGender: " + gender);

    newUserDB(username, password, repassword, gender, (error, result) => {
        console.log("The result from insertNewUser from the DB is: ", result)

        if (error || result == null) {
            console.log("Why got error?\n", error)
            res.status(500).json({Success: false, data: error});
        } else {
            // Back to Login page
            res.render("login");
        }
    });
}

function newUserDB (username, password, repassword, gender, callback) {
    console.log("In newUserDB function");

    // client.connect((err) => {
    //     if(err) {
    //         console.log("Error with connecting to DB: ", err);
    //         callback(err, null);
    //     } else {
            // console.log("DB corrected!");

            let sql_users = "INSERT INTO users(user_id, user_name, password, gender) VALUES(DEFAULT, $1, $2, $3)";

            let users_params = [username, password, gender];

            // Inserting into users table
            pool.query(sql_users, users_params, (err, result) => {
                console.log("Inserting into USERS");

                if (err) {
                    console.log("ERROR: Problem with inserting query into users table: ", err);
                    callback(err, null);
                }

                // Query result
                console.log("The result of the new user is: ", result);

                // Return back the result
                callback(null, result);

                // End the connection
                // client.end((err) => {
                //     if (err) {
                //         console.log("ERROR: Problem with ending the connection: ", err);
                //         throw err;
                //     }
                // });
            });
        // }
    // });
}

module.exports = insertNewUser;