const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended: true}));

var port = 8080;
var bmiResult = 0;
var bmiResponse = "";
var errorMessage = "";
var color = "";

app.listen(port, function(){
    console.log('Port opened on: ' + port);
});

app.get('/', function(req, res){
    res.render('index', {
        pageTitle: 'BMI Calculator',
        errorMessage: errorMessage
    });
});

app.post('/', function(req, res){
    // Vaatab kas kõik väljad on täidetud.
    if(req.body.age == "" || req.body.height == "" || req.body.weight == ""){
        errorMessage = 'Please fill all fields!';
        res.render('index', {
            pageTitle: 'BMI Calculator',
            errorMessage: errorMessage
        });
    // Vaatab vanust.
    } else if (req.body.age > 60 || req.body.age < 20){
        errorMessage = 'This program can only accurately calculate BMI for people between the age of 20 and 60.';
        res.render('index', {
            pageTitle: 'BMI Calculator',
            errorMessage: errorMessage
        });
        req.body.age = "";
        req.body.height = "";
        req.body.weight = "";
    // Kui kõik on õige.
    } else {
        // Salvestab info.
        bmiResult = (req.body.weight / (Math.pow(req.body.height / 100, 2))).toFixed(1);
        res.redirect('/result');
        var errorMessage = "";
    }
});

app.get('/result', function(req, res){

    if(isNaN(bmiResult) || bmiResult == 0){
        res.redirect('/');
    }

    if(bmiResult < 18.5){
        bmiResponse = "underweight";
        color = 'red';
    }
    if(bmiResult > 18.5 && bmiResult <= 25){
        bmiResponse = "normal weight";
        color = 'green';
    }
    if(bmiResult > 25 && bmiResult <= 30){
        bmiResponse = "overweight";
        color = 'red';
    }
    if(bmiResult > 30){
        bmiResponse = "obese";
        color = 'red';
    }

    res.render('result', {
        pageTitle: 'BMI Calculator Result',
        bmiResult: bmiResult,
        bmiResponse: bmiResponse,
        responseColor: color
    });
    
});

app.post('/result', function(req, res){
    res.redirect('/');
});