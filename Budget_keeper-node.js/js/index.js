// require('dotenv').config()
const express = require("express")
let app = express()
// const path = require('path')
// const cool = require("cool-ascii-faces")
// const PORT = process.env.PORT || 5000
const rounter = express.Router()
const {Pool} = require("pg")
const connectionString = process.env.DATABASE_URL || "postgres://adrianyim:adrianyim@localhost:5432/cs313"
const pool = new Pool({connectionString: connectionString})

// app.use(express.static(path.join(__dirname, 'public')))
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')
app.set("port", (process.env.PORT || 5000))
  // app.get('/', (req, res) => res.render('pages/getRate'))
app.get('/cool', (req, res) => res.send(cool()))
  // app.get('/rateResult', vaildation)
  // app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
app.get("/person", getPerson)
app.listen(app.get("port"), () => {
  console.log("Listening for connections on: ", app.get("port"));
})

// Business level
function getPerson(req, res) {
  console.log('In the getPerson function');

  let id = req.query.id;
  console.log("The id is", id);

  personDB(id, (error, result) => {
      if(error || result == null || result.length != 1) {
      res.status(500).json({success:false, data:error});
    }

    console.log("DB result:", result);
    res.json(result);
  });
}

function personDB(id, callback) {
  console.log("In personDB id: ", id);

  let sql = "SELECT id, first, last, date_of_birth FROM person;";
  let params = [id];

  pool.query(sql, params, (error, result) => {
    if (error) {
      console.log("An erroror is found!!");
      console.log(error);
      callback(error, null);
    }

    console.log("The DB result: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });
}

// Using pool 
// const pool = new Pool({connectionString: connectionString})

// pool.query('SELECT * FROM person;', (error, res) => {
//   console.log(error, res)
//   pool.end()
// })

// // Using client
// const client = new Client({connectionString: connectionString})
// client.connect()

// client.query('SELECT * FROM person;', (error, res) => {
//   console.log(error, res)
//   client.end()
// })

  // vaildation function
function vaildation(req, res) {
  const weight = Number(req.query.weight);
  const type = req.query.types;
  let weight_ = "";
  let type_ = "";
  let rate = "";
  let vaild = true;

  if (weight == "") {
      weight_ = "missing!!";
      vaild = false;
  } 
  
  if (type == "") {
      type_ = "missing!!";
      vaild = false;
  } 

  if (vaild) {
      calculateRate(res, weight, type, rate);
  } else {
      rate = "erroror!!";
      res.render('pages/rateResult', {weight: weight_, type: type_, rate: rate});
  }
}

// CalculateRate function
function calculateRate (res, weight, type, rate) {
  switch (type) {
      case ("Letters (Stamped)"):
          if (weight <= 1) {
              rate = "$0.55";
          } else if (weight <= 2) {
              rate = "$0.70";
          } else if (weight <= 3) {
              rate = "$0.85";
          } else  if (weight >= 3) {
                  rate = "$1.00";
          }

          break;

      case ("Letters (Metered)"):
          if (weight <= 1) {
              rate = "$0.50";
          } else if (weight <= 2) {
              rate = "$0.65";
          } else if (weight <= 3) {
              rate = "$0.80";
          } else  if (weight >= 3) {
                  rate = "$0.95";
          }

          break;

      case ("Large Envelopes (Flats)"):

          if (weight <= 1) {
              rate = "$1.00";
          } else if (weight <= 2) {
              rate = "$1.15";
          } else if (weight <= 3) {
              rate = "$1.30";
          } else  if (weight <= 4) {
              rate = "$1.45";
          } else if (weight <= 5) {
              rate = "$1.60";
          } else if (weight <= 6) {
              rate = "$1.75";
          } else if (weight <= 7) {
              rate = "$1.90";
          } else  if (weight <= 8) {
              rate = "$2.05";
          } else if (weight <= 9) {
              rate = "$2.20";
          } else if (weight <= 10) {
              rate = "$2.35";
          } else if (weight <= 11) {
              rate = "$2.50";
          } else if (weight <= 12) {
              rate = "$2.65";
          } else if (weight <= 13) {
              rate = "$2.80";
          } else {
              rate = "Overweight!!";
          }

          break;

      case ("First-Class Package Service—Retail"):

          if (weight <= 1) {
              rate = "$3.66";
          } else if (weight <= 2) {
              rate = "$3.66";
          } else if (weight <= 3) {
              rate = "$3.66";
          } else  if (weight <= 4) {
              rate = "$3.66";
          } else if (weight <= 5) {
              rate = "$4.39";
          } else if (weight <= 6) {
              rate = "$4.39";
          } else if (weight <= 7) {
              rate = "$4.39";
          } else  if (weight <= 8) {
              rate = "$4.39";
          } else if (weight <= 9) {
              rate = "$5.19";
          } else if (weight <= 10) {
              rate = "$5.19";
          } else if (weight <= 11) {
              rate = "$5.19";
          } else if (weight <= 12) {
              rate = "$5.19";
          } else if (weight <= 13) {
              rate = "$5.71";
          } else {
              rate = "Overweight!!";
          }

          break;
      }

  res.render('pages/rateResult', {weight: weight, type: type, rate: rate});
}