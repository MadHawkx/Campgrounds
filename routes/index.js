var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
router.get("/", function(req,res){
	//Landing Page
	res.render("landing");
})



//====================
//authorization Routes
//===================
router.get("/register",function(req,res){
	res.render("register");
})
router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username})
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.render("register", {"error": err.message})
		}
	passport.authenticate("local")(req,res,function(){
		req.flash("success","Welcome to Camping "+user.username);
		res.redirect("/campgrounds");
	})
	})
})

//Login routes
router.get("/login",function(req,res){
	
	res.render("login");//this is how we handle it 
	
})
router.post("/login",passport.authenticate("local"),function(req,res){
	req.flash("Success", "You are now logged in!")
	res.redirect("/campgrounds" || "/login");
})
//logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you Out!");
	res.redirect("/campgrounds");
})



module.exports=router;