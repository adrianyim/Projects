const {Pool} = require("pg");

// const connectionString = process.env.DATABASE_URL;
const connectionString = process.env.LOCAL_DB_URL;

// const client = new pg.Client(connectionString);

const pool = new Pool({connectionString: connectionString});

// Select function
function selectItems (req, res) {
    console.log("In the selectItems function");

    let username = req.session.username;

    console.log("Username from select function: ", username);

    selectDB(username, (error, result) => {
        console.log("The result from selectItems from the DB is:\n" , result.map(row => `${row.date}`));

        if (error || result == null || result.length == 0) {
            console.log("Why got error?", error, result, result.length);
            res.status(500).json({success: false, data: error});
        } else {
            res.json(result);
        }
    });
}

// SELECT query function
function selectDB (username, callback) {
    console.log("In selectDB function");

    // pool.connect((err) => {
    //     if (err) {
    //         console.log("Error with DB!");
    //         console.log(err);
    //         callback(err, null);
    //     }

        let sql = "SELECT i.user_name, i.item_id, i.item, i.item_type, i.remark, (SELECT c.cost FROM cost c WHERE c.cost_id = i.cost_id) AS cost, (SELECT c.cost_type FROM cost c WHERE c.cost_id = i.cost_id) AS cost_type, (SELECT d.date FROM date d WHERE d.date_id = i.date_id) AS date FROM items i WHERE user_name = $1 ORDER BY date";
        
        let select_params = [username];

        pool.query(sql, select_params, (err, result) => {
            if (err) {
                console.log("Error in query, ", err);
                callback(err, null);
            }
            // const now = new Date();
            console.log("\nThe result rows of selectItems:\n" + JSON.stringify(result.rows));
            for (var i=1; i<result.rows.length+1; i++){
                console.log("Row = " + i + " Date =  " + result.rows.map(row => `${row.date}`));
            }
            // Return back 
            callback(null, result.rows);
        });
    // });
}

module.exports = selectItems;