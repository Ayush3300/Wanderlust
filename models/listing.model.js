const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review.model.js")

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    review : [
        {type : Schema.Types.ObjectId,
        ref : "Review"}
    ]
});

//post mongoose schema
listingSchema.post("findOneAndDelete" , async(listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.review}})
    }
    
})


const Listing  = mongoose.model("Listing",listingSchema)
module.exports = Listing

