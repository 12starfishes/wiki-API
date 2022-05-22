const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// TODO

// <----------------- Routes for all Articles ----------------->

app.route("/articles")

.get(function(req, res) {
    Article.find(function(err, foundArticles) {
        if(!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    })
})

.post(function(req, res) {
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });

    article.save(function(err) {
        if(!err) {
            res.send("Successfully added.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany(function(err){
        if(!err) {
            res.send("Successfully Deleted.");
        } else {
            res.send(err);
        }
    });
});

// <----------------- Routes for specific Article ----------------->

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, specificArticle) {
        if(specificArticle) {
            res.send(specificArticle);
        } else {
            res.send("not found");
        }
    });
})

.put(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {new: true}, 
        function(err){
            if(!err){
                res.send("Successfully updated.")
            }
        });
})

.patch(function(req, res) {

    console.log(req.body);
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set : req.body},
        function(err) {
            if(!err) {
                res.send("Successfully updated using patch.");
            }
        }
    );
})

.delete(function(req, res) {
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if(!err) {
                res.send("Successfully Deleted.");
            }
        }
    );
});


app.listen(3000, function() {
    console.log("Port is successfully set up.")
});