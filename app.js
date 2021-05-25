const express= require("express");
const app=express();
const bodyParser= require('body-parser');
const mongoose= require("mongoose");
const flash=require("connect-flash");
const methodOverride=require("method-override");
const Campground=require("./models/campgrounds")
const seedDb=require("./seeds");
const Comment=require("./models/comment");
const geo        = require('mapbox-geocoding');
const passport=require("passport"),
	User=require("./models/user"),
	LocalStrategy=require("passport-local"),
	passportLocalMongoose=require("passport-local-mongoose");
// seedDb();
geo.setAccessToken('pk.eyJ1IjoibWFkaGF3a3h4IiwiYSI6ImNrOXk1ZGMwNTBsOXkzZ3BrcnhxcGRsY3QifQ.OGsnypXeKTvXalHa6KCBFQ');


var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp_V4",{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

//Passport config
app.use(require("express-session")({
	secret:"Welcome to the secret chamber",
	resave:false,
	saveUninitialized:false
}))
app.locals.moment=require("moment");
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Below is a middleware which helps in passing info about user tp all routes not only /campgrounds 
app.use(function(req,res,next){
	res.locals.currentUser =req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);//in campgroundRoutes it automatically adds /campground b4 ecery rout
app.use("/campgrounds/:id/comments",commentRoutes);


// Campground.create({
// name:"Granite Hill",
// image:"https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
// description:"This is a huge granite hill, with great ambience and atmosphere. A fresh water stream just adjacent to it is available as well."
// }, function(err,campground){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("Newly created Campground: "+ campground);
// 	}
// });

// var campgrounds=[
// 		{name:"Salmon Creek", image:"https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"},
// 		{name:"Granite Hill", image:"https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"},
// 		{name:"Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1545572695-789c1407474c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80"},
// 	{name:"Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1545572695-789c1407474c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80"},
// 	{name:"Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1545572695-789c1407474c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80"},
// 	{name:"Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1545572695-789c1407474c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80"},
// 	{name:"Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1545572695-789c1407474c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80"},
// 	]






app.listen(process.env.PORT||3000, process.env.IP, function(){
	console.log("Server Connected");
})