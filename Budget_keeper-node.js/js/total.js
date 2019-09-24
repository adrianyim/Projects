const total = document.getElementById("total");
const url = "http://localhost:1010/selectItems";
// const url = "https://adrianyim-node.herokuapp.com/selectItems";

fetch(url)
.then(res => {
    res.json().then(json => {
        total.innerHTML = `<table><tr>` + totalTable(json) + `</tr></table>`;
    });
})
.catch((error) => {
console.log(error);
});

function totalTable(json) {
    let row = json.map(rows => `${rows.cost}`);

    return `${row}`;
}