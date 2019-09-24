const {Pool} = require("pg");

// const connectionString = process.env.DATABASE_URL;
const connectionString = process.env.LOCAL_DB_URL;
const pool = new Pool({connectionString: connectionString});

const app = require("express").Router();

app.get("/updateItem", (req, res, next) => {
    console.log("In updateItem page");
    let item_id = req.query.id;
    // let item_id = req.params.id;
    let item, item_type, remark, cost, cost_type, date;

    callItem(item_id, (error, result) => {
        if (error || result == null || result.length == 0) {
            console.log("Why got error?", error, result, result.length);
            res.status(500).json({success: false, data: error});
        } else {
            let stringify = JSON.parse(result);

            for (let i = 0; i < stringify.length; i++) {
                item = stringify[i]['item'];
                item_type = stringify[i]['item_type'];
                remark = stringify[i]['remark'];
                cost = stringify[i]['cost'];
                cost_type = stringify[i]['cost_type'];
                date = stringify[i]['date'];

                console.log("The item is: ", item, item_type, remark, cost, cost_type, date);
            }
    
            // Direct to updateItem page
            res.render("updateItem", {
                username: req.session.username,
                item_id: req.query.id,
                item: item,
                item_type: item_type,
                remark: remark,
                cost: cost,
                // cost_type: cost_type,
                date: date
            });
            next();
        }
    });

    function callItem (item_id, callback) {
        console.log("The updating id is: " + item_id);

        let sql = "SELECT i.item_id, i.item, i.item_type, i.remark, (SELECT c.cost FROM cost c WHERE c.cost_id = i.cost_id) AS cost, (SELECT c.cost_type FROM cost c WHERE c.cost_id = i.cost_id) AS cost_type, (SELECT d.date FROM date d WHERE d.date_id = i.date_id) AS date FROM items i WHERE item_id = $1";
        let select_params = [item_id];

        pool.query(sql, select_params, (err, result) => {
            if (err) {
                console.log("Error in query, ", err);
                callback(err, null);
            }

            callback(null, JSON.stringify(result.rows));
        });
    }
});

module.exports = app;
