const express = require("express");
const router = new express.Router();
const bodyParser = require('body-parser');
const Recipie = require('../models/recipie');
const Ingredient = require('../models/ingredient');
const cookieParser = require("cookie-parser");
const AdminverifyToken = require('../middelware/admin-auth');
const multer = require('multer');
const path = require("path");


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());
const imageStorage = multer.diskStorage({  
    destination: '../public/images', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
    }
});

const imageUpload = multer({
    storage: imageStorage}).single('file');
router.get('/get-recipies',AdminverifyToken,async (req,res)=>{
    try {
        const data = await Recipie.find();
        res.render('get-recipies',{"reci":data})
    } catch (error) {
        res.send(error)
    }
});

router.get("/edit_recipie/:id",AdminverifyToken,async (req,res)=>{
    try {
        const arr = []
        const _id = req.params.id
        const data = await Recipie.findById(_id)
        const ingre = await Ingredient.find()
        for (let i in data.ingredient){ 
            const ing = await Ingredient.findById({_id:data.ingredient[i]})
            arr.push(ing)
        }
        res.render("edit-recipie",{"ingre":ingre,"rename":data.name,"redesc":data.desc,"reimg":data.img,"ing":arr,"id":_id})
    } catch (error) {
        res.send(error)
    }
});

router.post('/edit_recipie/:id',AdminverifyToken,imageUpload,async (req,res) => {
    try {
        const _id = req.params.id
        const name = req.body.name
        const desc = req.body.desc
        const img = req.body.file
        const ingre = req.body.ingres
        const result =await Recipie.findByIdAndUpdate(_id,{name:name,desc:desc,img:img,ingredient:ingre},{new:true});
        const d = await result.save()
        res.redirect('/get-recipies/')
    } catch (error) {
        res.send(error);
    }
});

router.post('/del-recipie/:id',AdminverifyToken,async (req,res) => {
    try {
        const _id = req.params.id
        const result = await Recipie.findByIdAndDelete(_id);
        res.redirect('/get-recipies/')
    } catch (error) {
        res.send(error);
    }
});

router.get("/add_recipie",AdminverifyToken,async (req,res)=>{
    try{
        const ingre = await Ingredient.find();
        res.render('add_recipie',{'ingre':ingre});
            
    }catch(e){
        res.send(e);
    }
});

router.post('/add_recipie',AdminverifyToken,imageUpload,async (req,res) => {
    try {
        const ingres = req.body.ingres
        const name = req.body.name
        const desc = req.body.desc
        const img = req.file.filename
        const data = new Recipie({name:name,desc:desc,img:img,ingredient:ingres})
        const result = await data.save()
        res.redirect('/add_recipie/')
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;