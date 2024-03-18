const express=require("express");
const port=8080;
const ejsMate=require('ejs-mate');//FOR STYLING
const methodOverride=require("method-override");
const mongoose=require("mongoose");

const User=require("./models/users.js");
const Level=require("./models/levels.js");
const Question=require("./models/questions.js");

const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");

const app=express();
const path=require("path"); //for ejs

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const {saveRedirectUrl, isLoggedIn}=require("./middleware.js");

MONGO_URL='mongodb://127.0.0.1:27017/gesturo';

main()
    .then(()=>{
        console.log('Connection Successful! DB Connected!');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOptions={
    secret:'mysupersecretcode',
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+ 1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.listen(port,()=>{
    console.log("App is listening to port",port);
});

app.get("/",(req,res)=>{
    res.render("./landing.ejs");
});

app.get("/home",(req,res)=>{
    res.render("./home.ejs");
});




//USER AUTHENTICATION:
app.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

app.post("/signup",async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success",`Welcome to Cognifi @${username}!`);
        res.redirect("/");
    });
}catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
});

app.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
});

app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/");
    });

});

app.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),(async(req,res,next)=>{
    req.flash("success","Successfully logged in!");
    let redirectUrl=res.locals.redirectUrl || "/";
    res.redirect("/");
}));


app.get("/level/:levelId/question/:quesId",isLoggedIn,async(req,res)=>{
    console.log(req.params);
    let {quesId}=req.params;
    let {levelId}=req.params;
    // console.log(quesId);
    // console.log(quesId);
    // let {levelId}=req.params;
    question=await Question.findById(quesId);
    level=await Level.findById(levelId);
    // console.log(level);
    res.render("./play/questions.ejs",{question,level});

});

app.get("/user/:userId",isLoggedIn,async(req,res)=>{
    levels=await Level.find({}).populate("questions");
    res.render("./play/level.ejs",{levels});

});





