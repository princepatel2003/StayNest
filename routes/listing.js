const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingController = require("../controllers/listings.js");


//all items (index)
router.get("/", wrapAsync(listingController.index));

//new items  this will above the show index 
router.get("/new", isLoggedIn,listingController.newForm);



// show index
router.get("/:id", wrapAsync(listingController.showListing));

// create routes
router.post("/", validateListing, isLoggedIn, wrapAsync(listingController.createListing));

//edit rout
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//update route
router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(listingController.updateListing));

//delete rout
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;