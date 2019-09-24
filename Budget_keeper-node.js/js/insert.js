const moment = require("moment");
const {Pool} = require("pg");

// const connectionString = process.env.DATABASE_URL;
const connectionString = process.env.LOCAL_DB_URL;

// const client = new pg.Client(connectionString);
const pool = new Pool({connectionString: connectionString});

// Insert function
const insertItems = (req, res) => {
    console.log("In insertItems function");

    // Retrieve data from client side
    let item = req.body.item;
    let item_type = req.body.item_type;
    let cost = req.body.cost;
    let cost_type = req.body.cost_type;
    let remark = req.body.remark;
    let username = req.session.username;

    console.log("The retrieve data are: \nItem: " + item + "\nItem_type: " + item_type + "\nCost: " + cost + "\nCost_type: " +  cost_type + "\nRemark: " + remark + "\nUSERNAME: " + username);

    insertDB(item, item_type, cost, cost_type, remark, username, (error, result) => {
        console.log("The result from insertItems from the DB is: " , result);

        if (error || result == null) {
            console.log("Why got error?\n", error);
            res.status(500).json({success: false, data: error});
        } else {
            // Back to Home page
            res.render("home", {
                username: req.session.username
            });
        }
    });
}

// INSERT query function
const insertDB = (item, item_type, cost, cost_type, remark, username, callback) => {
    console.log("In insertDB function");

    // Connect to DB
    // client.((err) => {
    //     if (err) {
    //         console.log("Error with connecting to DB: ", err);
    //         callback(err, null);
    //     }

        // console.log("DB corrected!");
        const now = new Date();
        // current_timestamp
        let m = moment().format("MM/DD/YYYY");
        console.log("Today is: ", m);

        let combinedResult;

        // SQL queries
        let sql_items = "INSERT INTO items (item_id, item, item_type, remark, cost_id, date_id, user_name) VALUES (DEFAULT, $1, $2, $3, DEFAULT, DEFAULT, $4)";

        let sql_cost = "INSERT INTO cost (cost_id, cost, cost_type) VALUES (DEFAULT, $1, $2)";
        
        let sql_date = "INSERT INTO date (date_id, date) VALUES (DEFAULT, $1)";

        let cost_params = [cost, cost_type];

        let items_params = [item, item_type, remark, username];

        let date_params = [now];

        // Inserting into cost table
        pool.query(sql_cost, cost_params, (err, result) => {
            console.log("Inerting into COST");

            if (err) {
                console.log("ERROR: Problem with insert query into cost table: ", err);
                callback(err, null);
            }

            // Query result
            // console.log(result);
            combinedResult += result; 

            // Inserting into date table
            pool.query(sql_date, date_params, (err, result) => {
                console.log("Inerting into DATE");
                
                if (err) {
                    console.log("ERROR: Problem with insert query into date table: ", err);
                    callback(err, null);
                }

                // Query result
                // console.log(result);
                combinedResult += result; 

                // Inserting into items table
                pool.query(sql_items, items_params, (err, result) => {
                    console.log("Inerting into ITEMS");

                    if (err) {
                        console.log("ERROR: Problem with insert query into items table: ", err);
                        callback(err, null);
                    }

                    // Query result
                    // console.log(result);
                    combinedResult += result; 

                    callback(null, combinedResult);
                });
            });
        });
    // });
}

module.exports = insertItems;