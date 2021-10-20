const express = require("express");
const router = new express.Router();
const bodyParser = require('body-parser');
const Admin = require('../models/admin');
const cookieParser = require("cookie-parser");
const AdminverifyToken = require('../middelware/admin-auth');
const bcryptjs = require('bcryptjs');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());

router.get('/admin_register',(req,res)=>{
    try {
        if (req.cookies.jwt == undefined){
        res.render('admin-register');
        }
        else{
            res.redirect('/admin-profile/')
        }
    } catch (error) {
        res.send(error)
    }
});

router.post('/admin_register',async (req,res)=>{
    try {
        if (req.cookies.jwt == undefined){
            if (req.body.password == req.body.password2){
            const user = new Admin(req.body)
            const result = await user.save()
            res.redirect('/admin-login/')
            }
            else{
                res.send("Password Not Match!!")
            }
        }
        else{
            res.redirect('/admin-profile/')
        }
    } catch (error) {
        res.send(error)
    }
});

router.get('/admin-login', (req,res)=>{
    try {
        if (req.cookies.jwt == undefined){
            res.render('admin-login',{user:true});
        }
        else{
            res.redirect('/admin-profile/');
        }
    } catch (error) {
        res.send(error)
    }
});

router.post('/admin-login',async(req,res)=>{
   try {
        if (req.cookies.jwt == undefined){
        const data = await Admin.findOne({email:req.body.email})
        const verify = await bcryptjs.compare(req.body.password,data.password);
            if (verify){
                    const token = await data.generateAuthToken();
                    res.cookie('jwt',token,{expires: new Date(Date.now()+86400*1000)});
                    res.redirect('/admin-profile/');
                }
        }
        else{
            res.redirect('/admin-profile/')
        }
   } catch (error) {
       res.send(error);
   }
});

router.get('/admin-profile',AdminverifyToken, (req,res)=>{
    try {
        res.render('profile')
        }
    catch (error) {
        res.send(error)
    }
});

router.get('/admin-logout',async(req,res)=>{
    try {
        if (req.cookies.jwt != undefined){
        res.clearCookie("jwt");
        res.redirect('/admin-login/');
        }
        else{
            res.redirect('/admin-login/')
        }
    }
    catch (error) {
        res.send(error)
    }
});

module.exports = router;