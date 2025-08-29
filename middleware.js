const Listing=require("./models/listing");
const Review=require("./models/review");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/expressError.js");



module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){ //kya user login hai
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to created listing !");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async (req,res,next)=>{
    let {id} = req.params;
     let listing =await Listing.findById(id);
     if(!listing.owner.equals(res.locals.currUser._id)){
        
        req.flash("error","you are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
     }
     next();
}

module.exports.validateListing=(res,req,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview=(res,req,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor= async (req,res,next)=>{
    let {id,reviewId} = req.params;
     let review =await Review.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)){
        
        req.flash("error","you are not the owner of the reivew");
        return res.redirect(`/listings/${id}`);
     }
     next();
}