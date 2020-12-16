//jshint esversion:6
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true,useUnifiedTopology: true})
console.log(process.env.API_KEY)

const userSchema = new mongoose.Schema({
  email:"String",
  password:"String"
})

userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ["password"] })


const User = new mongoose.model("User",userSchema)

const app = express()
app.set("view engine","ejs")

app.use(bodyParser.urlencoded({"extended":true}))
app.use(express.static("public"))

app.get("/",function(req,res){
  res.render("home")
})

app.get("/register",function(req,res){
  res.render("register")
})

app.get("/login",function(req,res){
  res.render("login")
})

app.post("/register",function(req,res){

const newUser1 = new User({
  email:req.body.username,
  password:req.body.password
})

newUser1.save(function(err){
  if(err){
    console.log(err)
  }
  else{
    res.render("secrets")
  }
})

})

app.post("/login",function(req,res){

const username = req.body.username
const password = req.body.password

User.findOne({email:username},function(err,foundItem){
  if (err){
    console.log(err)
  }
  else{
    if (password === foundItem.password){
      res.render("secrets")
    }
    else{
      res.render("Login")
    }
  }
})

})













app.listen(3000,function(){
  console.log("port is listing")
})
