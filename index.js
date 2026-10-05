require("dotenv").config();
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError.js");

// authentication
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const session=require("express-session");
const flash=require("connect-flash");

const listingsRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); // Parse incoming form data
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL=process.env.MONGO_URL;

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
 async function main(){
    await mongoose.connect(MONGO_URL);
}

//for the Express-session
const sessionOptions={
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 *24*60*60*1000,
        httpOnly: true,
    }
}
//use session
app.use(session(sessionOptions));
app.use(flash());
//initialise passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.get("/",(req,res)=>{
    res.send("app is working");
});

//middleware for the flash
app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next()
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

// for the other routes which do not exist
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

// middleware controller
app.use((err,req,res,next)=>{
    console.log(err);
    let {statusCode=500, message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("app is listen on 8080");
});
