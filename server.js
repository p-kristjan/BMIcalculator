// Node package esile kutsumine.
const express = require('express');
const bodyParser = require('body-parser');

// Express kasutamine.
const app = express();
app.use(express.static('public'));

// Body parser kasutamine.
app.use(bodyParser.urlencoded({extended: true}));

// Ejs ühendamine.
app.set('view engine', 'ejs');
app.set('views', 'views');

// Pordi sätestamine.
var port = 8080;

// Kõik vajalikud muutujad mida kasutada .ejs failides.
var bmiResult = 0;
var bmiResponse = "";
var errorMessage = "";
var color = "";

// Kui pordiga ühendatakse, see kood aktiveerub.
app.listen(port, function(){
    console.log('Port opened on: ' + port);
});

app.get('/', function(req, res){
    // Kui ühendatakse peamise leheküljega, pandakse index.ejs vaateks. Render annab edasi mis ejs näitab browseris.
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
        // Kõik valesti täidetud väljad tehakse tühjaks, et läbi '/result' kirjutades URL lõppu ei saaks edasi minna.
        req.body.age = "";
        req.body.height = "";
        req.body.weight = "";
    // Kui kõik on õige.
    } else {
        // Salvestab info.
        bmiResult = (req.body.weight / (Math.pow(req.body.height / 100, 2))).toFixed(1);
        // Viib edasi result lehele.
        res.redirect('/result');
        // Kõiksugused errorid mis võisid enne olla kustutakse ära.
        var errorMessage = "";
    }
});

app.get('/result', function(req, res){

    // Kui BMI tulemust mis pidi peale '/' POST meetodi tulema ei ole või BMI tulemuse väärtus on 0, siis viib tagasi
    // pealehele ja kood lõpetatakse.
    if(isNaN(bmiResult) || bmiResult == 0){
        res.redirect('/');
        return;
    }

    // Leiab vastava kirjelduse BMI tulemusele, mis leiti peale '/' POST meetodit. Veel leiab mis värvi tulemuse
    // kirjeldus panna.
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

    // Kui tulemus, tulemuse kirjeldus ja kirjelduse värv on olemas, saadetakse see result.ejs faili.
    res.render('result', {
        pageTitle: 'BMI Calculator Result',
        bmiResult: bmiResult,
        bmiResponse: bmiResponse,
        responseColor: color
    });
    
});

// See on '/result' POST meetod, mis käivitub kui sellel lehel vajutatakse "back" nuppu.
app.post('/result', function(req, res){
    res.redirect('/');
});