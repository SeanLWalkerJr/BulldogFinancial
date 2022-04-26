const express = require("express")
const app = express()
const mysql = require("mysql")
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
require("dotenv").config()
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT
const db = mysql.createPool({
   connectionLimit: 100,
   host: DB_HOST,
   user: DB_USER,
   password: DB_PASSWORD,
   database: DB_DATABASE,
   port: DB_PORT
})//remember to include .env in .gitignore file

db.getConnection( (err, connection)=> {   if (err) throw (err)
   console.log ("DB connected successful: " + connection.threadId)})
   const port = process.env.PORT
app.listen(port, 
      ()=> console.log(`Server Started on port ${port}...`))

const bcrypt = require("bcrypt")

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

// a variable to save a session
var session;

app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    res.sendFile('views/signin.html',{root:__dirname})
});

app.get('/signin', (req, res) => {
   //res.send('You are on the sign in page');
   res.sendFile('views/signin.html', {root:__dirname})
})

app.get('/signup', (req, res) => {
   //res.send('You are on the sign up page');
   res.sendFile('views/signup.html', {root:__dirname})
})


//middleware to read req.body.<params>
//CREATE USER
app.post("/signup", async (req,res) => {
   const user = req.body.username
   const hashedPassword = await bcrypt.hash(req.body.password,10)
   db.getConnection( async (err, connection) => { if (err) throw (err) 
      const sqlSearch = "SELECT * FROM userTable WHERE user = ?"
      const search_query = mysql.format(sqlSearch,[user]) 
      const sqlInsert = "INSERT INTO userTable VALUES (0,?,?)"
      const insert_query = mysql.format(sqlInsert,[user, hashedPassword])
      // ? will be replaced by values
      // ?? will be replaced by string await 
      connection.query (search_query, async (err, result) => {  if (err) throw (err)
      console.log("------> Search Results")
      console.log(result.length)  
      if (result.length != 0) {
         connection.release()
         console.log("------> User already exists")
         res.sendStatus(409) 
      } 
      else {
         await connection.query (insert_query, (err, result)=> {   
            connection.release() 
            if (err) throw (err)
            console.log ("--------> Created new User")
            console.log(result.insertId)
            res.sendStatus(201)
         }) //end of connection.query()
      }
   }) //end of db.getConnection
 })  //end of app.post()
})

//LOGIN (AUTHENTICATE USER)
app.post("/signin", (req, res)=> {const user = req.body.username
   const password = req.body.password
   db.getConnection ( async (err, connection)=> { if (err) throw (err)
   const sqlSearch = "Select * from userTable where user = ?"
   const search_query = mysql.format(sqlSearch,[user]) 
   await connection.query (search_query, async (err, result) => {  connection.release() 
      if (err) throw (err)  
      if (result.length == 0) {
         console.log("--------> User does not exist")
         res.sendStatus(404)
      } 
      else {
         const hashedPassword = result[0].password
         //get the hashedPassword from result    
         if (await bcrypt.compare(password, hashedPassword)) {
            console.log("---------> Login Successful")
            session=req.session;
            session.userid=req.body.username;
            res.send(`${user} is logged in!`)
         } 
         else {
            console.log("---------> Password Incorrect")
            res.send("Password incorrect!")
         } //end of bcrypt.compare()  
      }//end of User exists i.e. results.length==0 
   }) //end of connection.query()}) //end of db.connection()
   }) //end of app.post()
})
   
//const generateAccessToken = require("./generateAccessToken")
//import the generateAccessToken function//LOGIN (AUTHENTICATE USER, and return accessToken)
/*
app.post("/login", (req, res)=> {const user = req.body.name
const password = req.body.passworddb.getConnection ( async (err, connection)=> {if (err) throw (err)
 const sqlSearch = "Select * from userTable where user = ?"
 const search_query = mysql.format(sqlSearch,[user])
 await connection.query (search_query, async (err, result) => {connection.release()
  
  if (err) throw (err)
  if (result.length == 0) {
   console.log("--------> User does not exist")
   res.sendStatus(404)
  } 
  else {
   const hashedPassword = result[0].password
   //get the hashedPassword from result
   if (await bcrypt.compare(password, hashedPassword)) {
    console.log("---------> Login Successful")
    console.log("---------> Generating accessToken")
    const token = generateAccessToken({user: user})   
    console.log(token)
    res.json({accessToken: token})
   } else {
    res.send("Password incorrect!")
   }}}) //end of Password incorrect}//end of User exists}) //end of connection.query()}) //end of db.connection()}) //end of app.post()
})})
*/