var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   price:String,
   name: String,
   image: String,
   description: String,
   lat:Number,
   long:Number,
  createdAt: { type: Date, default: Date.now }, 
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
//export 
module.exports = mongoose.model("Campground", campgroundSchema);