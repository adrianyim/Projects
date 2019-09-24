const error = document.getElementById("error");

if (req.body.username == "" || req.body.password == "")
error.innerHTML = "Wrong username or password!";