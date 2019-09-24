const {Pool} = require("pg");

// const connectionString = process.env.DATABASE_URL;
const connectionString = process.env.LOCAL_DB_URL;

const pool = new Pool({connectionString: connectionString});

// Update function
function updateItems (req, res) {
    console.log("In updateItems function");

    // Retrieve data from client side
    let item_id = req.body.item_id;
    let item = req.body.item;
    let item_type = req.body.item_type;
    let cost = req.body.cost;
    let cost_type = req.body.cost_type;
    let remark = req.body.remark;
    let date = req.body.date;

    console.log("The retrieve data are: ");
    console.log("Item: ", item);
    console.log("Item_type: ", item_type);
    console.log("Cost: ", cost);
    console.log("Cost_type: ", cost_type);
    console.log("Remark: ", remark);
    console.log("Item_id: ", item_id);
    
    updateDB(item, item_type, cost, cost_type, remark, date, item_id, (error, result) => {
        console.log("The result from updateItems from the DB is: " , result);

        if (error || result == null) {
            console.log("Why got error?", error, result);
            res.status(500).json({success: false, data: error});
        } else {
            // Back to Home page
            res.render("home", {
                username: req.session.username
            });
        }
    });
}

// UPDATE query function
const updateDB = (item, item_type, cost, cost_type, remark, date, item_id, callback) => {
    console.log("In updateDB function");

    // Connect to DB
    // client.connect((err) => {
    //     if (err) {
    //         console.log("Error with connecting to DB: ", err);
    //         callback(err, null);
    //     }

        // console.log("DB corrected!");

        let combinedResult;

        // SQL queries
        let sql_items = "UPDATE items SET item = $2, item_type = $3, remark = $4 WHERE item_id = $1";

        let sql_cost = "UPDATE cost SET cost = $2, cost_type = $3 WHERE cost_id = $1";
        
        let sql_date = "UPDATE date SET date = $2 WHERE date_id = $1";

        let items_params = [item_id, item, item_type, remark];

        let cost_params = [item_id, cost, cost_type];

        let date_params = [item_id, date];

        // Updating cost table
        pool.query(sql_cost, cost_params, (err, result) => {
            console.log("Updating COST");

            if (err) {
                console.log("ERROR: Problem with updating query on cost table: ", err);
                callback(err, null);
            }

            // Query result
            // console.log(result);
            combinedResult += result; 

            // Updating date table
            pool.query(sql_date, date_params, (err, result) => {
                console.log("Updating DATE");
                
                if (err) {
                    console.log("ERROR: Problem with updating query on date table: ", err);
                    callback(err, null);
                }

                // Query result
                // console.log(result);
                combinedResult += result; 

                // Updating items table
                pool.query(sql_items, items_params, (err, result) => {
                    console.log("Updaing ITEMS");

                    if (err) {
                        console.log("ERROR: Problem with updaing query on items table: ", err);
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

module.exports = updateItems;