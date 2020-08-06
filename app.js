const mysql = require("mysql2")
const express = require("express")
const bodyParser = require("body-parser")
const handlebars = require('express-handlebars')
const config = require('./config')
const app = express();
const url = require('url')
const path = require('path')

const {app,BrowserWindow} = require('electron')
const module = require('module')

const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool(config)

app.set("view engine", "hbs")

// HOMEPAGE
app.get("/", function(req, res){
    pool.query("SELECT * FROM users", function(err, data) {
        if(err) {
            return console.log(err)
        }
        res.render("index.hbs", {
            users: data
        })
    })
})

// CREATE
app.get("/create", function(req, res){
    res.render("create.hbs")
})

// CREATE
app.post("/create", urlencodedParser, function (req, res) {

    if(!req.body) {
        return res.sendStatus(400)
    }

    const name = req.body.name
    const number = req.body.number
    pool.query("INSERT INTO users (name, number) VALUES (?,?)", [name, number], function(err, data) {
        if(err){
            return console.log(err)
        }
        res.redirect("/")
    })
})

// EDIT
app.get("/edit/:id", function(req, res){
    const id = req.params.id
    pool.query("SELECT * FROM users WHERE id=?", [id], function(err, data) {
        if(err) {
            return console.log(err)
        }
        res.render("edit.hbs", {
            user: data[0]
        })
    })
})

// EDIT
app.post("/edit", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400)
    const name = req.body.name
    const number = req.body.number
    const id = req.body.id

    pool.query("UPDATE users SET name=?, number=? WHERE id=?", [name, number, id], function(err, data) {
        if(err) return console.log(err)
        res.redirect("/")
    })
})

// DELETE
app.post("/delete/:id", function(req, res){

    const id = req.params.id
    pool.query("DELETE FROM users WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err)
        res.redirect("/")
    })
})

app.listen(3000, function(){
    console.log("localhost 3000...")
})