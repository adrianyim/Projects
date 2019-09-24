const output = document.getElementById("output");
const total = document.getElementById("total");
const url = "http://localhost:1010/selectItems";
// const url = "https://adrianyim-node.herokuapp.com/selectItems";

fetch(url)
.then(res => {
    res.json().then(json => {
        output.innerHTML = `<table><tr><th>Item</th><th>Item Type</th><th>Cost</th><th>Cost Type</th><th>Remark</th><th>Date</th></tr>` + drawTable(json) + `<tr><td>Total</td><td>` + sum(json) + `</td></tr></table>`;
    });
})
.catch((error) => {
console.log(error);
});

function drawTable(json) {
    console.log(json);
    let row = json.map(rows => `<tr><td>${rows.item}</td><td>${rows.item_type}</td><td>${rows.cost}</td><td>${rows.cost_type}</td><td>${rows.remark}</td><td>${rows.date}</td><td><button onclick="window.location.href='/updateItem?id=${rows.item_id}';">Update</button></td><td><button onclick="window.location.href='/handleDelete?id=${rows.item_id}';">Delete</button></td></tr>`).join("\n");

    return `${row}`;
}

function sum(json) {
    // let row = `${json.map(rows => `${rows.cost}`)}`;

    let sum = 0;
    for(let i = 0; i < Object.keys(json).length; i++) {
        sum += Object.values(json)[i]['cost'];
        console.log(sum);
    }

    return sum;
  }
      
//   var sample = { a: 1 , b: 2 , c:3 };
//   var summed = sum( sample );
//   console.log( "sum: "+summed );