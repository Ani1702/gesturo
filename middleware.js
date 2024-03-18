let Level=require("./models/levels.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create/attempt quiz!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let level=await Level.findById(id);
    if(!level.owner.equals(res.locals.currUser._id)){
        req.flash("You don't have permission to edit");
        return res.redirect(`/user/${currUser._id}`);
    }
}
