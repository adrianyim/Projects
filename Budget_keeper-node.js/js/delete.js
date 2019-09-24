const {Pool} = require("pg");

// const connectionString = process.env.DATABASE_URL;
const connectionString = process.env.LOCAL_DB_URL;

const pool = new Pool({connectionString: connectionString});

// Delete function
function deleteItems (req, res) {
    console.log("In deleteItems function");

    let item_id = req.body.item_id;
    // let item_id = req.params.id;

    console.log("Item_id that going to delete: ", item_id);

    deleteDB(item_id, (error, result) => {
        // console.log("The result from deleteItems from the DB is: " , result);

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

// DELETE query function
const deleteDB = (item_id, callback) => {
    console.log("In deleteDB function");

    // Connect to DB
    // client.connect((err) => {
    //     if (err) {
    //         console.log("Error with connecting to DB: ", err);
    //         callback(err, null);
    //     }

    //     console.log("DB corrected!");

        let combinedResult;

        // SQL queries
        let sql_items = "DELETE FROM items WHERE item_id = $1";

        let sql_cost = "DELETE FROM cost WHERE cost_id = $1";
        
        let sql_date = "DELETE FROM date WHERE date_id = $1";

        let items_params = [item_id];

        // Deleting items table
        pool.query(sql_items, items_params, (err, result) => {
            console.log("Deleting ITEMS");

            if (err) {
                console.log("ERROR: Problem with deleting query on items table: ", err);
                callback(err, null);
            }

            // Query result
            console.log(result);
            combinedResult += result; 

            // Deleting date table
            pool.query(sql_date, items_params, (err, result) => {
                console.log("Deleting DATE");
                
                if (err) {
                    console.log("ERROR: Problem with deleting query on date table: ", err);
                    callback(err, null);
                }

                // Query result
                console.log(result);
                combinedResult += result; 

                // Deleting cost table
                pool.query(sql_cost, items_params, (err, result) => {
                    console.log("Deleting COST");

                    if (err) {
                        console.log("ERROR: Problem with deleting query on cost table: ", err);
                        callback(err, null);
                    }

                    // Query result
                    console.log(result);
                    combinedResult += result; 

                    callback(null, combinedResult);
                });
            });
        });
    // });
}

module.exports = deleteItems;