const express = require("express");
const router = new express.Router();
const bodyParser = require('body-parser');
const MealsPlan = require('../models/mealsplan');
const Recipie = require('../models/recipie');
const cookieParser = require("cookie-parser");
const AdminverifyToken = require('../middelware/admin-auth');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());


router.get("/add_meals",AdminverifyToken,async (req,res)=>{
    try {
         const reci = await Recipie.find();
         res.render('meals',{'reci':reci});
         }
     catch (error) {
        res.send(error)
    } 
 });
 
 router.post('/add_meals',AdminverifyToken,async (req,res) => {
     try {
         
     const name = req.body.name
     const bf = req.body.bf
     const ms = req.body.ms
     const lu = req.body.lu
     const as = req.body.as
     const di = req.body.di
 
     const data = new MealsPlan({name:name,break_fast:bf,morning_snacks:ms,lunch:lu,afternoon_snacks:as,dinner:di})
     const result = await data.save()
     res.redirect('/add_meals/')
     }
     catch (error) {
         res.send(error);
     }
 });
 
 
router.get('/get-meals',AdminverifyToken,async (req,res)=>{
    try {
        const data = await MealsPlan.find();
        res.render('get-meals',{"meals":data})
    } catch (error) {
        res.send(error)
    }
});

router.get("/edit_meal/:id",AdminverifyToken,async (req,res)=>{
    try {
        const _id = req.params.id
        const data = await MealsPlan.findById(_id)
        const reci = await Recipie.find()
        const bf = await Recipie.findById({_id:data.break_fast})
        const ms = await Recipie.findById({_id:data.morning_snacks})
        const lu = await Recipie.findById({_id:data.lunch})
        const as = await Recipie.findById({_id:data.afternoon_snacks})
        const di = await Recipie.findById({_id:data.dinner})
        res.render("edit-meal",{"id":_id,"bf":bf,"ms":ms,"lu":lu,"as":as,"di":di,'reci':reci,'data':data})
    } catch (error) {
        res.send(error)
    }
});


router.post('/edit_meal/:id',AdminverifyToken,async (req,res) => {
    try {
        const _id = req.params.id
        const name = req.body.name    
        const bf = req.body.bf
        const ms = req.body.ms
        const lu = req.body.lu
        const as = req.body.as
        const di = req.body.di
        const result =await MealsPlan.findByIdAndUpdate(_id,{name:name,break_fast:bf,morning_snacks:ms,lunch:lu,afternoon_snacks:as,dinner:di},{new:true});
        const d = await result.save()
        res.redirect('/get-meals/')
    } catch (error) {
        res.send(error);
    }
});

router.post('/del-meal/:id',AdminverifyToken,async (req,res) => {
    try {
        const _id = req.params.id
        const result = await MealsPlan.findByIdAndDelete(_id);
        res.redirect('/get-meals/')
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;
