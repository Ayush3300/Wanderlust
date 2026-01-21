const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.model.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings)
    res.render("listings/index", { allListings });
  }),
);

//Static routes come first, and dynamic routes come later.
//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }),
);

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({ path: "review", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exits!");
      return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  }),
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exits!");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  }),
);

//Update Route
router.put(
  "/:id",
  validateListing,
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstruct (parameter ko individual value me convert and pass)
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }),
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }),
);

module.exports = router;
