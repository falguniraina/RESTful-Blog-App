var express=       require("express"),
methodOverride=    require("method-override"),
expressSanitizer=   require("express-sanitizer"),
app =              express(),
bodyParser=        require("body-parser"),
mongoose =         require("mongoose");

mongoose.connect("mongodb+srv://falguniraina:falguniraina@cluster0.3fl7a.mongodb.net/BlogApp?retryWrites=true&w=majority",{
useNewUrlParser : true,
useCreateIndex : true
}).then(()=>{
    console.log("Connected to DB!");
}).catch(err => {
    console.log("ERROR:",err.message);
});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date , default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);


app.get("/", function(req, res){
    res.redirect("/blogs"); 
 });
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
       if(err) {
           console.log("ERROR");
       }else{
           res.render("index",{blogs:blogs});
       }
    });
});
app.get("/blogs/new",function(req,res){
    res.render("new");
});
app.post("/blogs",function(req,res){
    console.log(req.body);
    req.body.blog.body=req.sanitize(req.body.blog.body)
    console.log("===================")
    console.log(req.body);
    Blog.create(req.body.blog,function(err,newBlog){
    if(err){
        res.render("new");
    }else{
        res.redirect("/blogs")
    }
    });
});
app.get("/blogs/:id",function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
if(err){
    res.redirect("/blogs");
} else{
    res.render("show",{blog:foundBlog});
}
   });
});
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(er,res){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("edit",{blog:foundBlog});
       }
    });

});
app.put("/blogs/:id",function(req,res){
Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
     if(err){
         res.redirect("/blogs");
     } else{
         res.redirect("/blogs/" + req.params.id);
     }
});
});
app.delete("/blogs/:id",function(req,res){
Blog.findByIdAndRemove(req.params.id,function(err){
    if(err){
        res.redirect("/blogs");
    }else{
        res.redirect("/blogs");
    }
});});
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
module.exports = port;