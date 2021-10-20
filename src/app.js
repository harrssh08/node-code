const express =  require('express')
const app = express()

require('./db/conn');
const adminroutes = require('../src/route/admin')
const daysroutes = require('../src/route/days')
const ingreroutes = require('../src/route/ingredients')
const mealroutes = require('../src/route/mealsplans')
const reciroutes = require("../src/route/recipies")

const path = require("path")
const hbs = require('hbs');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');


const templatePath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');
app.use(cookieParser());
app.set('view engine','hbs')
app.set('views',templatePath);
hbs.registerPartials(partialsPath);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use("/", adminroutes);
app.use("/", daysroutes);
app.use("/", ingreroutes);
app.use("/", mealroutes);
app.use("/", reciroutes);



app.get('/',(req,res)=>{
    try {
        if (req.cookies.jwt == undefined){
        res.render('home')
        }
        else{
            res.redirect('admin-profile')
        }
    }
    catch (error) {
        res.send(error)
    }
});

app.get('/error', (req,res)=>{
    res.render('error')
});

app.listen(3000,()=>{
    console.log("Serving On this port 3000")
});


