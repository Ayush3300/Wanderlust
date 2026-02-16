const Listing = require("../models/listing.model");
const maptiler = require("@maptiler/client");
maptiler.config.apiKey = process.env.MAPTILER_KEY;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.newForm = (req, res) => {
  res.render("listings/new");
};

module.exports.createListing = async (req, res, next) => {
  let response = await maptiler.geocoding.forward(req.body.listing.location, {
    limit: 1,
  });
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.features[0].geometry;
  let ListingSaved = await newListing.save();
  console.log(ListingSaved);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exits!");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exits!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstruct (parameter ko individual value me convert and pass)
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  if(req.body.listing.location!==listing.location){
    const location = req.body.listing.location;
    const geoRes = await fetch(`https://api.maptiler.com/geocoding/${location}.json?key=${process.env.MAPTILER_KEY}`);
    const geoData = await geoRes.json();
    listing.geometry = geoData.features[0].geometry;
  }
  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  console.log(deletedList);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
