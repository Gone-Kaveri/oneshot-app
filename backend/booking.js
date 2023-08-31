const mongoose=require("mongoose");

const BookingDetailsSchema=new mongoose.Schema(
    {
        Name:String,
        Email:String,
        BookTime:Date,
        BookDate:String,
        Contact:Number,
    },
    {
        collection:"bookings",
    }
);
module.exports=mongoose.model("bookings",BookingDetailsSchema);