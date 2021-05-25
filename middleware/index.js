var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var User=require("../models/user");

//check if logged in owns the post
module.exports={checkCampgroundOwnership:	function(req,res,next){
	//is user logged in for that-
	if(req.isAuthenticated()){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
			res.redirect("back");//redirects to prev page
		}else{
		//does user own the campground?
//we can not do if(foundCampground.author.id===req.user.id) becuase one of them is string one monhoose object although it is printed as string, thus beow is mongoose's own method			
		if(foundCampground.author.id.equals(req.user.id)){
		next();
		}
		else{
			req.flash("error","You dont have permission to do that");
			res.redirect("back")
		}
		} 
	})
	}	
	else{
		
		req.flash("error","You need to be logged in to do that");
		res.redirect("/login");
	}
},
	
checkCommentOwnership:	function(req,res,next){
	//is user logged in for that-
	if(req.isAuthenticated()){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			req.flash("error","Campground not found");
			res.redirect("back");//redirects to prev page
		}else{
		//does user own the campground?
//we can not do if(foundCampground.author.id===req.user.id) becuase one of them is string one monhoose object although it is printed as string, thus beow is mongoose's own method			
		if(foundComment.author.id.equals(req.user._id)){
		next();
		}
		else{
			req.flash("error","You dont have permission to do that");
			res.redirect("back")
		}
		} 
	})
	}	
	else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("/login");
	}


},


isLoggedIn:	function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error","You need to be logged in to do that");//this just passes in flash details with next commands go to /login in index
		res.redirect("/login");
	}
}
}