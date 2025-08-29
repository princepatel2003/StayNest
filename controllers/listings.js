const Listing=require("../models/listing");
module.exports.index=async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}

module.exports.newForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let show = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    
    if (!show) {
        req.flash("error", "Listing is does not exist");
        res.redirect("/listings");
    }
    console.log(show);
    res.render("./listings/show.ejs", { show });
}

module.exports.createListing = async (req, res, next) => {
    // let {title,discription,price,location,country}=req.body;
    //  if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    //  }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created !");

    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing is does not exist");
        res.redirect("/listings");
    }
    req.flash("success", " Listing is edited !");
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    //  let listing =await Listing.findById(id);
    //  if(!listing.owner.equals(res.locals.currUser._id)){

    //     req.flash("error","you don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    //  }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstruct of info
    req.flash("success", " Listing updated !");
    res.redirect(`/listings/${id}`);
}
 
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    req.flash("success", " Listing is Deleted !");
    res.redirect("/listings");
}
