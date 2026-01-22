const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.model.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");

const listingController = require("../controllers/listing.cntroller.js");

router
  .route("/")
  // Index Route
  .get(wrapAsync(listingController.index))
  // Create Route
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing),
  );

//Static routes come first, and dynamic routes come later.
//New Route
router.get("/new", isLoggedIn, listingController.newForm);

router
  .route("/:id")
  //Show Route
  .get(wrapAsync(listingController.showListing))
  //Update Route
  .put(
    validateListing,
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.updateListing),
  )
  //Delete Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing),
);

module.exports = router;
