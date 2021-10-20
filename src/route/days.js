const express = require("express");
const router = new express.Router();
const bodyParser = require('body-parser');
const AdminverifyToken = require('../middelware/admin-auth');
const MealsPlan = require('../models/mealsplan');
const cookieParser = require("cookie-parser");
const Days = require('../models/days');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());

router.get("/add_days",AdminverifyToken,async (req,res)=>{
    try {
        const meals = await MealsPlan.find();
        res.render('days',{'meals':meals})
    } catch (error) {
        res.send(error)
    } 
 });

router.post('/add_days',AdminverifyToken,async (req,res) => {
    try {
        const cost = req.body.cost
        const name = req.body.name
        const meals = req.body.meals
        console.log(cost,name,meals)
        const data = new Days({day:name,cost:cost,meals:meals})
        const result = await data.save()
        res.redirect('/add_days/')
    } catch (error) {
        res.send(error);
    }
});
router.get('/get-days',AdminverifyToken,async (req,res)=>{
    try {
        const data = await Days.find();
        res.render('get-days',{"data":data})
    } catch (error) {
        res.send(error)
    }
});

router.get("/edit_day/:id",AdminverifyToken,async (req,res)=>{
    try {
        const _id = req.params.id
        const data = await Days.findById(_id)
        const meal = await MealsPlan.findById({_id:data.meals})
        const meals = await MealsPlan.find()
        res.render("edit-days",{"id":_id,'mealname':meal.name,'mealid':meal._id,'data':data,"meals":meals})
    } catch (error) {
        res.send(error)
    }
});

router.post('/edit_day/:id',AdminverifyToken,async (req,res) => {
    try {
        const _id = req.params.id
        const name = req.body.name    
        const cost = req.body.cost
        const meals = req.body.meals
        const result =await Days.findByIdAndUpdate(_id,{name:name,cost:cost,meals:meals},{new:true});
        const d = await result.save()
        res.redirect('/get-days/')
    } catch (error) {
        res.send(error);
    }
});

router.post('/del-day/:id',AdminverifyToken,async (req,res) => {
    try {
        const _id = req.params.id
        const result = await Days.findByIdAndDelete(_id);
        res.redirect('/get-days/')
    } catch (error) {
        res.send(error);
    }
});



module.exports = router;