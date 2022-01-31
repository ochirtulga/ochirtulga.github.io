const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const words = require('./javascripts/word');

app.set("view engine", "pug");
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(8000, () => {
    console.log("Server up and running!..");
})

app.get("/", (req, res) => {
    res.render("dict");
})

app.post("/check-term", (req, res) => {
    var word = req.body.word;
    words.findWord(req, res, word);
});