const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({
    extended: false
}))

app.listen(port, () => console.log("Server up and running!"));

app.post("/calculate", (req, res) => {
    var answer = 0;
    const num1 = parseInt(req.body.first);
    const num2 = parseInt(req.body.second);
    if(req.body.operation == "add") {
        answer = num1 + num2;
    } else if (req.body.operation == "subtract") {
        answer = num1 - num2;
    } else if (req.body.operation == "multiply") {
        answer = num1 * num2;
    } else if (req.body.operation == "divide") {
        answer = num1 / num2; 
    }
    res.status(200).send(
        "The Answer is: " + answer 
        + "<br /> " 
        + "<a href='/'>Another calculation</a>").end();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+'/simplecalc.html'));
  });

app.all("*", (req, res) => {
    res.status(404).send("Page not found! <br /> <a href='/'>Click here to return Home!</a>").end();
})
