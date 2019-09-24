const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
  console.log("In the home page");
  res.render("budgetkeeper-home");
});

module.exports = app;











// function setTime() {
//   var d = new Date(),
//     el = document.getElementById("time");

//     el.innerHTML = formatAMPM(d);

//   setTimeout(setTime, 1000);
// }

// function formatAMPM(date) {
//   var hours = date.getHours(),
//   minutes = date.getMinutes(),
//   seconds = date.getSeconds(),
//   ampm = hours >= 12 ? 'pm' : 'am';
  
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? '0'+ minutes : minutes;
//   seconds = seconds < 10 ? '0'+ seconds : seconds;

//   var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

//   return strTime;
// }

// setTime();

