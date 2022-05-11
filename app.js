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

const bcrypt = require("bcrypt");
const { response } = require("express");

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

//app.engine('html', require('ejs').renderFile);
app.set('views',  __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    //res.sendFile('views/signin.html',{root:__dirname})
    //res.sendFile('/signin.html',{root:__dirname})
    res.sendFile('/homepage.html',{root:__dirname})
});

app.get('/signin', (req, res) => {
   //res.send('You are on the sign in page');
   res.sendFile('/signin.html', {root:__dirname})
})

app.get('/signup', (req, res) => {
   //res.send('You are on the sign up page');
   res.sendFile('/signup.html', {root:__dirname})
})

app.get('/landingpage', function(req, res) {
   // If the user is loggedin
	if (req.session.loggedin) {
		// Go to view balance page
		//res.sendFile('/viewbalance.html', {root:__dirname});
      res.sendFile('/landingpage.html',{root:__dirname});
	} else {
		// Not logged in
		res.send("Please <a href= '\signin.html'>login</a> to view this page!");
	}
	res.end();
});

app.post('/logout',(req,res) => {
   req.session.loggedin = false;
   req.session.destroy();
   res.redirect('/');
});

/*
app.get('/viewbalance',(req, res) => {
   // If the user is loggedin
	if (req.session.loggedin) {
		// Go to view balance page
		//res.sendFile('/viewbalance.html', {root:__dirname});
      res.sendFile('/viewbalance.html',{root:__dirname});
	} else {
		// Not logged in
		res.send("Please <a href= '\signin.html'>login</a> to view this page!");
	}
	res.end();
});
*/
app.post('/viewbalance',(req, res) => {
   db.getConnection ( async (err, connection)=> { if (err) throw (err)
      const sqlSearch = "Select * from users where email = ?"
      const search_query = mysql.format(sqlSearch,[session.userid])
      /* 
      connection.query(search_query, function(error, data)
      {
         if(error)
         {
            throw error;
         }
         else
         {
            response.render('/viewbalance', {balance: data});
         }
         
      });
      */
     
      
      await connection.query (search_query, async (err, result) => 
      {connection.release() 
         if (err) throw (err)  
         if (result.length == 0) 
         {
            console.log("--------> User does not exist")
            console.log(session.userid)
            res.sendStatus(404)
         } 
         else 
         {
            res.render('viewbalance', {balance: result[0]})
            //res.render('/viewbalance', {title: 'Balance', balance: result})
         }//end of User exists i.e. results.length==0 
      }) //end of connection.query()}) //end of db.connection()
      })
      //res.sendFile('/viewbalance.html',{root:__dirname});
      
});//});

app.post('/landingpage',(req, res) => {
      res.sendFile('/landingpage.html',{root:__dirname});
});

//middleware to read req.body.<params>
//CREATE USER
app.post("/signup", async (req,res) => {
   const user = req.body.username
   const hashedPassword = await bcrypt.hash(req.body.password,10)
   const email = req.body.email
   const firstname = req.body.firstname
   const lastname = req.body.lastname
   const role = req.body.role
   const balance = req.body.balance
   db.getConnection( async (err, connection) => { if (err) throw (err) 
      const sqlSearch = "SELECT * FROM users WHERE user = ?"
      const search_query = mysql.format(sqlSearch,[user]) 
      //const sqlInsert = "INSERT INTO users VALUES (0,?,?)"
      //const sqlInsert = "INSERT INTO users (userid, user, password, email) VALUES (0,?,?,?)"
      const sqlInsert = "INSERT INTO users (userid, first_name, last_name, email, role, user, password, balance) VALUES (0,?,?,?,?,?,?,?)"
      const insert_query = mysql.format(sqlInsert,[firstname, lastname, email, role, user, hashedPassword, balance])
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
});

//LOGIN (AUTHENTICATE USER)
app.post("/signin", (req, res)=> {
   const user = req.body.username
   const email = req.body.email
   const password = req.body.password
   db.getConnection ( async (err, connection)=> { if (err) throw (err)
   const sqlSearch = "Select * from users where email = ?"
   const search_query = mysql.format(sqlSearch,[email]) 
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
            req.session.loggedin=true;
            session=req.session;
            session.userid=req.body.email;
            //session.email = req.body.email;
            //res.send(`${email} is logged in!`)
            res.sendFile('/landingpage.html', {root:__dirname})
         } 
         else {
            console.log("---------> Password Incorrect")
            res.send("Password incorrect!")
         } //end of bcrypt.compare()  
      }//end of User exists i.e. results.length==0 
   }) //end of connection.query()}) //end of db.connection()
   }) //end of app.post()
});

//const generateAccessToken = require("./generateAccessToken")
//import the generateAccessToken function//LOGIN (AUTHENTICATE USER, and return accessToken)

/*
app.post("/login", (req, res)=> {const user = req.body.name
   const password = req.body.passworddb.getConnection ( async (err, connection)=> {if (err) throw (err)
      const sqlSearch = "Select * from userTable where user = ?"
      const search_query = mysql.format(sqlSearch,[user])
      await connection.query (search_query, async (err, result) => {connection.release()
         if (err) throw (err)
         if (result.length == 0) 
         {
            console.log("--------> User does not exist")
            res.sendStatus(404)
         } 
         else 
         {
            const hashedPassword = result[0].password
            //get the hashedPassword from result
            if (await bcrypt.compare(password, hashedPassword)) 
            {
            console.log("---------> Login Successful")
            console.log("---------> Generating accessToken")
            const token = generateAccessToken({user: user})   
            console.log(token)
            res.json({accessToken: token})
            } 
            else 
            {
            res.send("Password incorrect!")
            }
         }
      }) //end of Password incorrect}//end of User exists}) //end of connection.query()}) //end of db.connection()}) //end of app.post()
   })
});

*/
