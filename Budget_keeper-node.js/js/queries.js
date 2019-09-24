const pg = require("pg");

const connectionString = "postgres://adrianyim:adrianyim@localhost:5432/budgetkeeper_db";
//process.env.DATABASE_URL || 
const client = new pg.Client(connectionString);

// Select function
const selectItems = (req, res) => {
    console.log("In the selectItems function");

    let username = req.session.username;

    console.log("Username from select function: ", username);

    selectDB(username, (error, result) => {
        console.log("The result from selectItems from the DB is: " , result);

        if (error || result == null || result.length == 0) {
            console.log("Why got error?", error, result, result.length);
            res.status(500).json({success: false, data: error});
        } else {
            console.log(JSON.stringify(result));
            res.json(result);
            // let list = [];
            // list.push(result);
            // res.session.select = JSON.stringify(result);
            // res.render("home");
        }
    });
}

// SELECT query function
const selectDB = (username, callback) => {
    console.log("In selectDB function");

    // let client = new pg.Client(connectionString);

    client.connect((err) => {
        if (err) {
            console.log("Error with DB!");
            console.log(err);
            callback(err, null);
        }

        let sql = "SELECT i.user_name, i.item_id, i.item, i.item_type, i.remark, (SELECT c.cost FROM cost c WHERE c.cost_id = i.cost_id) AS cost, (SELECT c.cost_type FROM cost c WHERE c.cost_id = i.cost_id) AS cost_type, (SELECT d.date FROM date d WHERE d.date_id = i.date_id) AS date FROM items i WHERE user_name = $1 ORDER BY date";
        
        let select_params = [username];

        client.query(sql, select_params, (err, result) => {
            client.end((err) => {
                if (err) throw err;
            });

            if (err) {
                console.log("Error in query, ", err);
                callback(err, null);
            }

            // console.log("Result is: " + JSON.stringify(result.rows));
            callback(null, result.rows);
        });
    });
}

// Insert function
const insertItems = (req, res) => {
    console.log("In insertItems function");

    // Retrieve data from client side
    let item = req.body.item;
    let item_type = req.body.item_type;
    let cost = req.body.cost;
    let cost_type = req.body.cost_type;
    let remark = req.body.remark;
    let username = res.locals.username;

    console.log("The retrieve data are: ");
    console.log("Item: ", item);
    console.log("Item_type: ", item_type);
    console.log("Cost: ", cost);
    console.log("Cost_type: ", cost_type);
    console.log("Remark: ", remark);
    console.log("USERNAME: ", username);

    insertDB(item, item_type, cost, cost_type, remark, username, (error, result) => {
        console.log("The result from insertItems from the DB is: " , result);

        if (error || result == null) {
            console.log("Why got error?", error, result);
            res.status(500).json({success: false, data: error});
        } else {
            // Back to Home page
            res.render("pages/budgetkeeper-home");
        }
        
    });
}

// INSERT query function
const insertDB = (item, item_type, cost, cost_type, remark, username, callback) => {
    console.log("In insertDB function");

    // Connect to DB
    client.connect((err) => {
        if (err) {
            console.log("Error with connecting to DB: ", err);
            callback(err, null);
        }

        console.log("DB corrected!");

        let combinedResult;

        // SQL queries
        let sql_items = "INSERT INTO items (item_id, item, item_type, remark, cost_id, date_id, user_name) VALUES (DEFAULT, $1, $2, $3, DEFAULT, DEFAULT, $4)";

        let sql_cost = "INSERT INTO cost (cost_id, cost, cost_type) VALUES (DEFAULT, $1, $2)";
        
        let sql_date = "INSERT INTO date (date_id, date) VALUES (DEFAULT, current_timestamp)";

        let cost_params = [cost, cost_type];

        let items_params = [item, item_type, remark, username];

        // Inserting into cost table
        client.query(sql_cost, cost_params, (err, result) => {
            console.log("Inerting into COST");
            console.log(cost_params);

            if (err) {
                console.log("ERROR: Problem with insert query into cost table: ", err);
                callback(err, null);
            }

            // Query result
            console.log(result);
            combinedResult += result; 

            // Inserting into date table
            client.query(sql_date, (err, result) => {
                console.log("Inerting into DATE");
                
                if (err) {
                    console.log("ERROR: Problem with insert query into date table: ", err);
                    callback(err, null);
                }

                // Query result
                console.log(result);
                combinedResult += result; 

                // Inserting into items table
                client.query(sql_items, items_params, (err, result) => {
                    console.log("Inerting into ITEMS");
                    console.log(items_params);

                    if (err) {
                        console.log("ERROR: Problem with insert query into items table: ", err);
                        callback(err, null);
                    }

                    // Query result
                    console.log(result);
                    combinedResult += result; 

                    callback(null, combinedResult);

                    // End the query
                    client.end((err) => {
                        if (err) {
                            console.log("Error with ending the query: ", err);
                            throw err;
                        }
                    });
                });
            });
        });
    });
}

// Update function
const updateItems = (req, res) => {
    console.log("In updateItems function");

    // Retrieve data from client side
    let item = req.body.item;
    let item_type = req.body.item_type;
    let cost = req.body.cost;
    let cost_type = req.body.cost_type;
    let remark = req.body.remark;
    let date = req.body.date;
    let item_id = req.body.id;

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
            res.render("pages/budgetkeeper-home");
        }
        
    });
}

// UPDATE query function
const updateDB = (item, item_type, cost, cost_type, remark, date, item_id, callback) => {
    console.log("In updateDB function");

    // Connect to DB
    client.connect((err) => {
        if (err) {
            console.log("Error with connecting to DB: ", err);
            callback(err, null);
        }

        console.log("DB corrected!");

        let combinedResult;

        // SQL queries
        let sql_items = "UPDATE items SET item = $1, item_type = $2, remark = $3 WHERE item_id = $4";

        let sql_cost = "UPDATE cost SET cost = $1, cost_type = $2 WHERE cost_id = 2";
        
        let sql_date = "UPDATE date SET date = $1 WHERE date_id = 2";

        let items_params = [item, item_type, remark, item_id];

        let cost_params = [cost, cost_type];

        let date_params = [date];

        // Updating cost table
        client.query(sql_cost, cost_params, (err, result) => {
            console.log("Updating COST");
            console.log(cost_params);

            if (err) {
                console.log("ERROR: Problem with updating query on cost table: ", err);
                callback(err, null);
            }

            // Query result
            console.log(result);
            combinedResult += result; 

            // Updating date table
            client.query(sql_date, date_params, (err, result) => {
                console.log("Updating DATE");
                
                if (err) {
                    console.log("ERROR: Problem with updating query on date table: ", err);
                    callback(err, null);
                }

                // Query result
                console.log(result);
                combinedResult += result; 

                // Updating items table
                client.query(sql_items, items_params, (err, result) => {
                    console.log("Updaing ITEMS");
                    console.log(items_params);

                    if (err) {
                        console.log("ERROR: Problem with updaing query on items table: ", err);
                        callback(err, null);
                    }

                    // Query result
                    console.log(result);
                    combinedResult += result; 

                    callback(null, combinedResult);

                    // End the query
                    client.end((err) => {
                        if (err) {
                            console.log("Error with ending the query: ", err);
                            throw err;
                        }
                    });
                });
            });
        });
    });
}

// Delete function
const deleteItems = (req, res) => {
    console.log("In deleteItems function");
    
    deleteDB((error, result) => {
        console.log("The result from deleteItems from the DB is: " , result);

        if (error || result == null) {
            console.log("Why got error?", error, result);
            res.status(500).json({success: false, data: error});
        } else {
            // Back to Home page
            res.render("pages/budgetkeeper-home");
        }
        
    });
}

// DELETE query function
const deleteDB = (callback) => {
    console.log("In deleteDB function");

    // Connect to DB
    client.connect((err) => {
        if (err) {
            console.log("Error with connecting to DB: ", err);
            callback(err, null);
        }

        console.log("DB corrected!");

        let combinedResult;

        // SQL queries
        let sql_items = "DELETE FROM items WHERE item_id = 6";

        let sql_cost = "DELETE FROM cost WHERE cost_id = 6";
        
        let sql_date = "DELETE FROM date WHERE date_id = 6";

        // Deleting cost table
        client.query(sql_cost, (err, result) => {
            console.log("Deleting COST");

            if (err) {
                console.log("ERROR: Problem with deleting query on cost table: ", err);
                callback(err, null);
            }

            // Query result
            console.log(result);
            combinedResult += result; 

            // Deleting date table
            client.query(sql_date, (err, result) => {
                console.log("Deleting DATE");
                
                if (err) {
                    console.log("ERROR: Problem with deleting query on date table: ", err);
                    callback(err, null);
                }

                // Query result
                console.log(result);
                combinedResult += result; 

                // Deleting items table
                client.query(sql_items, (err, result) => {
                    console.log("Deleting ITEMS");

                    if (err) {
                        console.log("ERROR: Problem with deleting query on items table: ", err);
                        callback(err, null);
                    }

                    // Query result
                    console.log(result);
                    combinedResult += result; 

                    callback(null, combinedResult);

                    // End the query
                    client.end((err) => {
                        if (err) {
                            console.log("Error with ending the query: ", err);
                            throw err;
                        }
                    });
                });
            });
        });
    });
}

module.exports = {
    selectItems,
    insertItems,
    updateItems,
    deleteItems
}