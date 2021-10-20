const express = require("express");
const router = new express.Router();
const bodyParser = require('body-parser');
const Ingredient = require('../models/ingredient');
const AdminverifyToken = require('../middelware/admin-auth');
const cookieParser = require("cookie-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());


router.get("/add_ingredient",AdminverifyToken,async (req,res)=>{
    try{
        res.render('ingredient')
    }
    catch(e){
            res.send(e);
        }
    });

router.post('/add_ingredient',AdminverifyToken,async (req,res) => {
    try {
        const ingre = req.body.ingre
        const data = new Ingredient({name:ingre})
        const AddData = await data.save()
        res.redirect('/add_ingredient/');
    } catch (error) {
        res.send(error);
    }
});


router.get('/get-ingredients',AdminverifyToken,async(req,res)=>{
    try{
        const data = await Ingredient.find()
        res.render('get-ingredients',{"ingre":data});
    }
    catch(error){
        res.send(error)
    }
}); 

router.get('/get-ingredient/:id',AdminverifyToken,async (req,res)=>{
    try {
        const _id = req.params.id;
        const data = await Ingredient.findById(_id);
        res.render("edit-ingredient",{"name":data.name,"id":_id})
    } catch (error) {
        res.send(error)
    }
});

router.post('/del-ingredient/:id',AdminverifyToken,async(req,res)=>{
    try {
    const _id = req.params.id;
    const del = await Ingredient.findByIdAndDelete(_id);
    res.redirect('/get-ingredients/')
    } catch (error) {
        res.send(error)
    }
}); 

router.post('/get-ingredient/:id',AdminverifyToken,async(req,res)=>{
    try {
        const _id = req.params.id;
        const result = await Ingredient.findByIdAndUpdate(_id,req.body,{new:true});
        const d = await result.save()
        res.redirect('/get-ingredients/')
    } catch (error) {
        res.send(error)
    }
});

module.exports = router;