require("dotenv").config();

var express = require("express"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  PORT = process.env.PORT || 4002;
app = express();
var path = require("path");
const Blog = require('./model/blog');
const dbUrl = process.env.DATABASE_URL

app.use(express.static(path.join(__dirname, "public"))); // to serve the contents of the public directory, the public dir is where css and other assets lives
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true })); // has to be npm install body-parser --save
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "/views"));
app.use(expressSanitizer()); //has to be after the app.use(bodyParser)

mongoose
  .connect(dbUrl,
   {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("connection open");
  })
  .catch(err => {
    console.log(err);
  });


// Blog.create({
//   title: "test Blog",
//   image: "https://im.vsco.co/aws-us-west-2/b63639/3119133/5eb6849d492d22201dbcff2c/vsco5eb684a04ca95.jpg?w=995&dpr=1",
//   body: "Hello this is a blog post"
// });

//restful routes
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

//index route
app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("errror");
    } else {
      res.render("index", {
        blogs: blogs
      });
    }
  });
});

//new route
app.get("/blogs/new", function(req, res) {
  res.render("new"); //ejs = embedded javascript
});

// create routes
app.post("/blogs", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

//show route
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

//edit route
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//update route

app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(
    err,
    updatedBlog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

app.delete("/blogs/:id", function(req, res) {
  //destroy blog
  Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.get("*", function(req, res) {
  res.send("Not found!");
});

app.listen(PORT, function() {
  console.log(`now listening on port ${PORT}`);
});
