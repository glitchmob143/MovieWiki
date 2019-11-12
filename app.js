//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
const app = express();

let queryList=[];
let element;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req,res){   //home request
  res.render("home");
});

app.get("/movies",function(req,res){        //movie list request
  res.render("movies", {movies: element});
  queryList.push(element);
});


app.post("/", function(req,res){            //movie search request
  let searchQuery = req.body.query;
  fetch("http://www.omdbapi.com/?apikey=6c6934&s="+searchQuery)
  .then(resp => resp.json())
  .then((body) => {
    if(body.Search === undefined){
      res.render("error");
    } else {
      let movies =body.Search;
      queryList.push(movies);
      res.render("movies", {movies: movies});
    }
  });
  });

app.post("/movie",function(req,res){        //description request
  let id= req.body.detSubmit;
  element=queryList.pop();

  fetch("http://www.omdbapi.com/?apikey=6c6934&i="+id)
  .then(res => res.json())
  .then((body) => {
    let movieDesc = body;
    if(movieDesc)
    res.render("movie", {movieDesc: movieDesc, id:id});
});
});

app.listen(3000,function(){
  console.log("Succesfully started sever on port 3000");
});
