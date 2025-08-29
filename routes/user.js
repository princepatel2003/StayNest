const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usercontroller = require("../controllers/users.js");


router.get("/signup",usercontroller.getSingup);

router.post("/signup",wrapAsync(usercontroller.createSingup));

router.get("/login",usercontroller.getLogin);

router.post("/login",saveRedirectUrl,
    passport.authenticate("local", 
        { failureRedirect: "/login",
      failureFlash:true, }),
    wrapAsync(usercontroller.createLogin))

router.get("/logout",usercontroller.logout);

module.exports=router;