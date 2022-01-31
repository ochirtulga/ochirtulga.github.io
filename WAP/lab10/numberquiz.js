const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const e = require('express');
const app = express();
const port = 3001;

app.set("view engine", "pug");

app.listen(port, () => console.log("Server up and running!"));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({
    extended: false
}));

const questions = [
    "3, 1, 4, 1, 5", // pi
    "1, 1, 2, 3, 5", // fibonacci
    "1, 4, 9, 16, 25", // squares
    "2, 3, 5, 7, 11", // primes
    "1, 2, 4, 8, 16", // powers of 2
];
const answers = [9, 8, 36, 13, 32];
var point = 0;
var index = 0;

app.get("/", (req, res) => {
    if(index == answers.length) {
        point = 0;
        index = 0;
    }
    res.render("numberquiz", { point: point, question: questions[index], answer: answers[index] });
})

app.post("/check-answer", (req, res) => {
    if (req.body.answer == answers[index]) {
        point += 1;
    } 
    index += 1;
    if (index == answers.length) {
        res.render("completed", {point: point, total: answers.length });
    } else {
        res.render("numberquiz", { point: point, question: questions[index], answer: answers[index] });
    }
});