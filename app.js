var express=require("express");
var mongoose=require("mongoose");
var app=express();
var passport=require("passport");
var bodyParser = require("body-parser");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var User=require("./models/user");

mongoose.connect("mongodb://localhost:27017/auth_demo",{useNewUrlParser:true,useUnifiedTopology:true});

app.set("view engine","ejs");

app.use(require("express-session")({
    secret:"Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================================


User.remove({},function(err){
    if(err)
        console.log(err);
})
app.get("/",function(req,res){
    res.redirect("/login");
});

app.get("/secret",isLoggedIn,function(req,res){
  res.render("secret");  
});
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
        else
            res.redirect('/login');
    });
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
         successRedirect: "/secret",
         failureRedirect: "/login"
}),function(req,res){
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

app.listen(3000,function(){
    console.log("Server online on port 3000");
});



function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.render("login")
}