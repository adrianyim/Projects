// var mykey = config.MY_KEY;
// var secretkey = config.SECRET_KEY;

// firebase.initializeApp(config);


// Global arrays
var grades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
var credits = [4, 3.7, 3.4, 3, 2.7, 2.4, 2, 1.7, 1.4, 1, 0.7, 0];
var inGrades = [];
var inCredits = [];
var className = [];

// Check empty function
function valid() {
    retrieve();

    // Check empty or not
    var error = false;
    var errorString = "";
    for ( var i=0; i<className.length; i++) {
        if (className[i] === "") {
            //alert("Input Error: Class Name " + eval(i+1) + " is missing!");
            errorString = "Class name is missing!" + "<br>";
            error = true;
        }
        
        if (inGrades[i] === "") {
            //alert("Input Error: Grade of Course " + eval(i+1) + " is missing!");
            errorString += "Grade is missing!" + "<br>";
            error = true;
        }
            
        if (inCredits[i] === "") {
            // alert("Input Error: Credit of Course " + eval(i+1) + " is missing!");
            errorString += "Credit is missing!" + "<br>";
            error = true;
        }
        
        document.getElementById('error').innerHTML = errorString;

        if (error === true) {
            break;
        }
    }

    // If there are no empty, then run the gpaCalc function
    if (error === false) {
        gpaCalc();
    }
}

// Main function of GPA
function gpaCalc() {  
    var grCount = 12; //Define valid grades and their values
    
    // Calculate GPA
    var totalGrades = 0;
    var totalCredits = 0;
    var gpa = 0;
    
    for (var x=0; x<document.getElementById('semester_tbody').rows.length; x++) {
        var valid = true;
        for (var y = 0; y < grCount; y++) {
            if (inGrades[x] == grades[y]) {
                totalGrades += (parseInt(inCredits[x], 10) * credits[y]);
                totalCredits += parseInt(inCredits[x], 10);
            }
        }
    }
    
    // GPA formula
    gpa = Math.round(totalGrades/totalCredits*100)/100;
    report(gpa);
}

// Display instrustion function
function disInstruction() {
    document.getElementById('instruct').onclick = function(){
        document.getElementById('display').innerHTML = "1. Enter your courses.<br/>2. Enter your perdicted or current grades.<br/>3. Enter your course credits.<br/>4. Click CALCULATE button.<br/>5. You can see your result.<br/>6. You may reset and repeat step (1 - 5).";
    }
}

// Display about function
function disAbout() {
    document.getElementById('about').onclick = function(){
        document.getElementById('display').innerHTML = "This is a simple GPA Calculator. The goal of this calculator is to predict and set your semester GPA by providing your class' grades and credits. <br/>This calculator provides you to have a short amount time to find out how many GPA you need. You will feel confident with the accurate information by using the GPA calculator.";
    }
}

// Clear inputs, result, error, and course
function getClear() {
    document.getElementById('result').innerHTML = "";
    document.getElementById('error').innerHTML = "";
    document.getElementById('course').innerHTML = "";
}

// Get input error**************************************
// function inputError() {
//     var input = document.getElementsByName('CR1').value;
//     if(0 < input <= 5) {
//         return true;
//     }
//     else {
//         // alert("ERROR: The first row of the credit is incorrect format!");
//         document.getElementById('error').innerHTML = "The credit is incorrect format!";
//         return false;
//     }
// }

// Retrieve inputs function
function retrieve() {
    var count;
    // Retrieve user inputs
    // For class names
    for (var i=0; i<document.getElementById('semester_tbody').rows.length; i++) {
        className[i] = document.GPACalcForm['n'+(i+1)].value;
    }
    // For grades
    for (var i=0; i<document.getElementById('semester_tbody').rows.length; i++) {
        inGrades[i] = document.GPACalcForm['GR'+(i+1)].value;
    }
    
    // For credits
    for (var i=0; i<document.getElementById('semester_tbody').rows.length; i++) {
        inCredits[i] = document.GPACalcForm['CR'+(i+1)].value;
    }  
}

// Report GPA function
function report(gpa) {
    var report = "<h2>Your Report</h2><br/>";
    document.getElementById("result").innerHTML = report;
    
    for (var i=0; i<document.getElementById('semester_tbody').rows.length; i++) {
        if (inGrades[i] === "") {
            break;
        }
        document.getElementById('result').innerHTML += "Class: " + className[i] + "&nbsp&nbsp&nbsp&nbsp Grade: " + inGrades[i] + "&nbsp&nbsp&nbsp&nbsp Credit: " + inCredits[i] + "<br/>";
    }
    document.getElementById('result').innerHTML += "<br/><h2>Your Semester GPA is: " + gpa + "</h2><br/>";
    return 0;
}

// Add classes function
function addRow() {
    var table = document.getElementById('semester_tbody');
    var row = table.insertRow(table.rows.length);

    row.insertCell(0).innerHTML = table.rows.length + ".";
    row.insertCell(1).innerHTML = "<input type='text' name='n" + (table.rows.length) + "' size='10' placeholder='CIT 261'>";
    row.insertCell(2).innerHTML = "<select id='GR" + (table.rows.length) + "'><option value='none'>—</option><option value='A'>A</option><option value='A-'>A-</option><option value='B+'>B+</option><option value='B'>B</option><option value='B-'>B-</option><option value='C+'>C+</option><option value='C'>C</option><option value='C-'>C-</option><option value='D+'>D+</option><option value='D'>D</option><option value='D-'>D-</option><option value='F'>F</option></select>";
    row.insertCell(3).innerHTML = "<input type='text' size='1' name='CR" + (table.rows.length) + "' ALIGN=TOP maxlength='1' placeholder='3'>";
}

// Remove classes function
function removeRow() {
    document.getElementById('semester_tbody').deleteRow(document.getElementById('semester_tbody').rows.length - 1);
}

// Firebase function
function gpaFirebase() {
    // Reference to 'department' select list
    var select = document.getElementById('department').value;

    // Reference to my firebase
    var database = firebase.database().ref(select);

    // A listener receives a snapshot from the firebase
    database.once('value', function(snapshot){
        if(snapshot.exists()){
            var content = '';
            content += '<table align="center"><tr><th>Course:</th><th>Credits:</th><th>Name:</th></tr>';

            snapshot.forEach(function(data){
                var course = data.val().course;
                var credits = data.val().credits;
                var name = data.val().name;

                // Display back to HTML page
                content += '<tr><td>' + course + '</td>';
                content += '<td>' + credits + '</td>';
                content += '<td>' + name + '</td>';
            });
            content += '</tr></table>';
            document.getElementById('course').innerHTML = content;
        } else {
            document.getElementById('course').innerHTML = "firebase doesn't exist!!";
        }
    });
}
