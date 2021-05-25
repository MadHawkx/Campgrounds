var express=require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var middleware=require("../middleware/index.js");//dont write /index.js cause it is a special name and always be required


router.get("/",function(req,res){
	//getting all campgrounds ffrom mongodb
	Campground.find({}, function(err,allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			 res.render("campgrounds/campgrounds",{campgrounds: allCampgrounds});
		}//req.user sends info of user that is logged in..
	})
	
})

router.post("/",middleware.isLoggedIn ,function(req,res){
	var name= req.body.name;
	var image=req.body.image;
	var price=req.body.price;
	var lat=req.body.lat;
	var long=req.body.long;
	var description=req.body.description;
	var author={
		id: req.user._id,
		username:req.user.username	
	}
	var newCampground={image: image,price:price, name: name, description:description, author: author,lat:lat,long:long};
	Campground.create(newCampground, function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{			
			res.redirect("/campgrounds");
		}
	});
})

router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req,res){
	//finding campgrounds with the id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			
			res.render("campgrounds/show.ejs",{campground: foundCampground})
		}
	})
})

//Edit campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit", {campground:foundCampground});
})
})


//Update campground Route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findOneAndDelete(req.params.id,function(err){
		if(err){res.redirect("/campgrounds")}
		else{res.redirect("/campgrounds");}
})
})
//middleware

	

module.exports=router