var express=require("express");
var router=express.Router({mergeParams:true});//to take id in common routes in app.js whre we added /campgrounds already
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var middleware=require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){console.log(err)
		}else{
			res.render("comments/new",{campground:campground})
		}
	})
})

router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){console.log(err);res.redirect("/campgrounds")}
		else{
		Comment.create(req.body.comment,function(err,comment){
			if(err){req.flash("error","Comment not created");}
			else{
			//add username and id to comment
			comment.author.id=req.user._id;//req.user._id and req.user.username are passport functionalities
				comment.author.username=req.user.username;
			//save comment	
			comment.save();
			campground.comments.push(comment)//campground what we got from above, comments is schema inside and"comment"is what we got from above
			campground.save();
			req.flash("success","Successfully added Comment");
			res.redirect("/campgrounds/"+campground._id);
			}
		})
		}
	})			
})
//edit comments
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
Comment.findById(req.params.comment_id,function(err,foundComment){
	if(err){
		res.redirect("back");
	}else{
		res.render("comments/edit",{campground_id:req.params.id,comment:foundComment})//passing campground id in app js 

	}
})
})
//updating comments
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back")
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//delete comments
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment successfully deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})


//authorizing comments


//middleware


module.exports=router;