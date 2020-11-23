//https://glitch.com/edit/#!/wry-certain-date?path=views%2Findex.html%3A1%3A0
//on glitch project name= wry-certain-date

const express = require("express")
const app = express()

let morgan = require("morgan");
app.use(morgan("combined"))

let bodyParser = require("body-parser");
app.use(bodyParser.raw({ type: "*/*" }));

const cors = require("cors");
app.use(cors())

//Copy paste the following endpoint into your project so that your sourcecode will be in the submission certificate
app.get("/sourcecode", (req, res) => {
    res.send(require('fs').readFileSync(__filename).toString())
    })

//test
app.get("/", (req, res)=>{
    //res.send("Hello World!")
    return res.send("Ping!")

} )

let users = new Map();
users.set("username", "bob2131");
users.set("bob", "xxx2131");
//{"username":"bob1","password":"pwd123"} 

//generate a new token on each new login or user connection or session
let genUniqueToken = () => {
    // console.log("generating a random Token = " + Math.floor(Math.random() * 1000000000000))
    return "" + Math.floor(Math.random() * 1000000000000)
}

//1-CREATE ENDPOINT /signup TO  create USER ACCOUNT
app.post("/signup", (req, res) => {
  console.log("1-Request to /signup received");
  console.log( "1-this is the body request (req.body)in JSON formatted string: " + req.body + " //" + typeof(req.body));

  // retrieve the HTTP request body using the req.body expression
  // PARSE the (req.body) JSON formatted string into JavaScript
  let parsedBody = JSON.parse(req.body);
  //console.log( "2-(req.body.username) is " + req.body.username + " " + req.body.password );//undefined
  let result = parsedBody.username + " " + parsedBody.password;
  console.log ("3-" + parsedBody.username + " " + parsedBody.password)
  console.log("4-users.has(result) is " + users.has(result));
  debugger;
  if (parsedBody.username === '' || parsedBody.username === null || parsedBody.username === undefined) {
    console.log("parsedBody.username is " + parsedBody.username);
    res.send(
      JSON.stringify({ success: false, reason: "username field missing" })
    );
  } else if (parsedBody.password === "" || parsedBody.password === undefined) {//undefined
    res.send(
      JSON.stringify({ success: false, reason: "password field missing" }));
  }

  if (!users.has(result)) { //if usernme not in map
    debugger;
    users.set(result);
     //users.set(parsedBody.username , parsedBody.password);
    let itemIds = Array.from(users.keys());
    for (let i = 0; i < itemIds.length; i++) {
      console.log("!!!!" + itemIds[i]);//ok
    }
    //var myJSON = JSON.stringify(obj)
    console.log("2-users.has(result) is " + users.has(result));
    console.log(JSON.stringify(users)); //{}
    res.send(JSON.stringify({ success: true }));//some kind of error here when the username=""
    } else {
      res.send(JSON.stringify({ success: false, reason: "Username exists" }));
  }
  console.log(result + " //" + typeof(result))//String
  return result
 
  });

//2-CREATE ENDPOINT /login 
app.post("/login", (req, res) => {

    // 1-some console to check
    console.log("1.0-Request to /login1 received");
    console.log( "1.1-this is the body request (req.body) in JSON formatted string: " + req.body + ", typeof(req.body) is " + typeof req.body );
    //(req.body) is {"username":"bob","password":"pwd123"}  
    
    // 2-retrieve the HTTP request body using the req.body expression
    // PARSE the (req.body) JSON formatted string into JavaScript
    let parsedBody = JSON.parse(req.body);
    let result = parsedBody.username + " " + parsedBody.password;
   
    
    //if user has signed up ie already in database? or I should call again the previous endpoint?
    //res.send("you logged in as ", JSON.stringify({username: parsedBody.username, password: parsedBody.password}));
  
    let usr = parsedBody.username
    console.log("usr = " + usr + ", does map has this usr?? " + users.has(usr) ) //username 
    let actualUserPass = parsedBody.password//bob2131
    console.log("actualUserPass = " + actualUserPass)//bob2131 
    let expectedUserPass = users.get(usr)
    console.log("expectedUserPass = " + expectedUserPass)//bob2131
   //console.log("actualUser is " + actualUser + ", actualPass " + actualPass + ", expectedUser " + expectedUser)
    
      if (actualUserPass === expectedUserPass) {
        console.log("checking if actualUserPass === expectedUserPass => " + actualUserPass + "===" + expectedUserPass)
        let uniqueToken = genUniqueToken()
        res.send(JSON.stringify({ success: true, token: uniqueToken }))
        return
      } else if (users.has(usr) && actualUserPass !== expectedUserPass ) {
            console.log("usr = " + usr + ", does map has this usr?? " + users.has(usr) )
            console.log("checking if actualUserPass ?== expectedUserPass => " + actualUserPass + "!==" + expectedUserPass)
            res.send(JSON.stringify({ success: false, reason: "Invalid password" }))
      }else if (usr=== '' || usr=== null || usr === undefined) {
      console.log("parsedBody.username is " + parsedBody.username);
      res.send(      JSON.stringify({ success: false, reason: "username field missing" }));
      } else if (actualUserPass === "" || actualUserPass === undefined || actualUserPass === null) {//undefined
      res.send(
        JSON.stringify({ success: false, reason: "password field missing" }));
    } 
    
    else
    res.send(JSON.stringify({ success: false, reason: "User does not exist" }))
  });
  
  //   // 3-CREATE ENDPOINT path: /create-channel  method: POST 
// app.post("/create-channel", (req, res) => {}
//  channelName 
// // if success
// // if token header missing
// // if token is invalid
// // if the channelName property is missing from the request body
// // If a channel with the same name already exists

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });

//app.listen(process.env.port || 3000)
//type in browser localhost:3000 or http://192.168.0.122:3000/
//under NPM, click on start=> it will give me the port nber "Your app is listening on port 53263" 
