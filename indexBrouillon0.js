//FinalProjectPart1
//ERRORS=> app.use(cors) INSTEAD OF app.use(cors());
//ERRORS=> app.use(cookieParser) INSTEAD OF app.use(cookieParser())
//parsedBody.password === undefined) INSTEAD OF parsedBody.password === "")
//not changing  from postman the appropriate method (GET or POST...)

const express = require("express");
const app = express();

//import library & attache it to webserver
//"combined" indicates the detail level of the logs.
let morgan = require("morgan");
app.use(morgan("combined"));


//add body-parser lib to To process the HTTP request body with Express.
//The library will process the HTTP request and extract its body before the request reaches your endpoint
let bodyParser = require("body-parser");
//many HTTP request has a content header that identifies what is in the HTTP Request.
//{type: "*/*"} => all HTTP will be handled by body parser.
app.use(bodyParser.raw({ type: "*/*" }));

const cors = require("cors");
app.use(cors());

//test
app.get("/", (request, response) => {
  return response.send("Ping!");
});

//Copy paste the following endpoint into your project so that your sourcecode will be in the submission certificate
app.get("/sourcecode", (req, res) => {
  res.send(
    require("fs")
      .readFileSync(__filename).toString());
});

let users = new Map();
//users.set("username", "bob2131");
users.set("bob", "xxx2131");
//users.set({"username":"bob", password:"xxx2131"});
//users.set({"username":"bob1","password":"pwd123"} )
//{"username":"box", "password":"box213x"}//JSON
//{"username":"AAA","password":"AAA123"} 

//generate a new token on each new login or user connection or session
let genUniqueToken = () => {
    // console.log("generating a random Token = " + Math.floor(Math.random() * 1000000000000))
    return "" + Math.floor(Math.random() * 1000000000000)
}

let token = 0
let getNext = () => {
    token = token + 1
    return token
}


//1-CREATE ENDPOINT /signup TO  create USER ACCOUNT
app.post("/signup", (req, res) => {
  let itemIds = Array.from(users.keys());
    for (let i = 0; i < itemIds.length; i++) {
      console.log("!!!!" + itemIds[i] );//ok
    }
  console.log("1.0-Request to /signup received");
  console.log( "1.1-this is the body request (req.body)in JSON formatted string: " + req.body + " //" + typeof(req.body));

  // retrieve the HTTP request body using the req.body expression
  // PARSE the (req.body) JSON formatted string into JavaScript
  let parsedBody = JSON.parse(req.body);
  //console.log( "2-(req.body.username) is " + req.body.username + " " + req.body.password );//undefined
  let result = parsedBody.username + " " + parsedBody.password;
  //let userName = JSON.parse(req.body).username
  //let passWord = JSON.parse(req.body).password
  
  
  console.log ("3-" + parsedBody.username + " " + parsedBody.password)
  console.log("4-users.has(result) is " + users.has(result));
  
  if (parsedBody.username === undefined) {
    console.log("parsedBody.username is " + parsedBody.username);
    return res.send(JSON.stringify({ success: false, reason: "username field missing" })
    );
  } else if (parsedBody.password === undefined) {
    return
  }else if(users.has(result)){
    let itemIds = Array.from(users.keys());
    for (let i = 0; i < itemIds.length; i++) {
      console.log("!!!!" + itemIds[i]);//ok
    }
    return  res.send(JSON.stringify({ success: false, reason: "Username exists" }));
  }else{
      //var myJSON = JSON.stringify(obj)
    console.log("2-users.has(result) is " + users.has(result));
    console.log(JSON.stringify(users));
    users.set(username, password)
    res.send(JSON.stringify({ success: true }));
  }

  console.log(result + " //" + typeof(result))//String
 // return result
 
  //mettre user ds cette map à la fin
  //users.set(userName, {"password": password})
  //users.set()
  //return qqch a mon api
  //res.send({"success" : true})) à la toute fin 
 
  });

//1-CREATE ENDPOINT /signup TO  create USER ACCOUNT
app.post("/signup1", (req, res) => {
  console.log("1-Request to /signup received");
  console.log( "1-this is the body request (req.body)in JSON formatted string: " + req.body + " //" + typeof(req.body));

  // retrieve the HTTP request body using the req.body expression
  // PARSE the (req.body) JSON formatted string into JavaScript
  let parsedBody = JSON.parse(req.body);
  //console.log( "2-(req.body.username) is " + req.body.username + " " + req.body.password );//undefined
  let result = parsedBody.username + " " + parsedBody.password;
  
// let username = JSON.parse(req.body).username
// let password = JSON.parse(req.body).password
  
  
  console.log ("3-" + parsedBody.username + " " + parsedBody.password)
  console.log("4-users.has(result) is " + users.has(result));
  debugger;
  if (parsedBody.username === undefined) {
    console.log("parsedBody.username is " + parsedBody.username);
    res.send(JSON.stringify({ success: false, reason: "username field missing" })
    );
  } else if (parsedBody.password === undefined) {
    return
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
      //return 
      res.send(JSON.stringify({ success: false, reason: "Username exists" }));
  }
  console.log(result + " //" + typeof(result))//String
  return result
 
  //mettre user ds cette map à la fin
  //users.set(userName, {"password": password})
  //users.set()
  //return qqch a mon api
  //res.send({"success" : true})) à la toute fin 
 
  });
//1-CREATE ENDPOINT /signup TO  create USER ACCOUNT
app.post("/signup2", (req, res) => {
  console.log("1.0-Request to /signup received");
  console.log( "1.1-this is the body request (req.body)in JSON formatted string: " + req.body + " //" + typeof(req.body));
  
  let parsedBody = JSON.parse(req.body);
  let result = parsedBody.username + " " + parsedBody.password;
  console.log("♣♣" + result)//♣♣AAA AAA123
//console.dir("♣♣" + result)//'♣♣AAA AAA123'
  
  let userName = JSON.parse(req.body).username;
  let userPassword = JSON.parse(req.body).password;
 // console.log("♦" , userName)
 
  if (userName === undefined) {
    return res.send(JSON.stringify({ success: false, reason: "username field missing" })
    );
  } else if (userPassword === undefined) {
    return res.send(
      JSON.stringify({ success: false, reason: "password field missing" })
    );
  } else if (users.has(userName)) {
    return res.send(
      JSON.stringify({ success: false, reason: "Username exists" })
    );
  } else {
    users.set(userName, { password: userPassword });
    //users.set({username: userName}, { password: userPassword });
    console.dir(users)//Map { { username: 'AAA' } => { password: 'AAA123' } }
    //console.log(users)

    return res.send(JSON.stringify({ success: true }));
  }
});

//2-CREATE ENDPOINT /login 
//users.get(userName).password
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
  console.log("♦usr = " + usr + ", does map has this usr?? " + users.has(usr) )
  let actualUserPass = parsedBody.password
  console.log("♣actualUserPass = " + actualUserPass)
  let expectedUserPass = users.get(usr)
  console.log("♠expectedUserPass = " + expectedUserPass)//bob2131
  
    if (actualUserPass === expectedUserPass) {
      console.log("♦♦checking if actualUserPass === expectedUserPass => " + actualUserPass + "===" + expectedUserPass)
      let uniqueToken = genUniqueToken()
      res.send(JSON.stringify({ success: true, token: uniqueToken }))
      return
    } else if (users.has(usr) && actualUserPass !== expectedUserPass ) {
          console.log("♣♣usr = " + usr + ", does map has this usr?? " + users.has(usr) )
          console.log("♣♣checking if actualUserPass ?== expectedUserPass => " + actualUserPass + "!==" + expectedUserPass)
          res.send(JSON.stringify({ success: false, reason: "Invalid password" }))
    }else if (usr=== '' || usr=== null || usr === undefined) {
    console.log("♠♠parsedBody.username is " + parsedBody.username);
    res.send(      JSON.stringify({ success: false, reason: "username field missing" }));
    } else if (actualUserPass === "" || actualUserPass === undefined || actualUserPass === null) {//undefined
    res.send(
      JSON.stringify({ success: false, reason: "password field missing" }));
  } 
  
  else
  res.send(JSON.stringify({ success: false, reason: "User does not exist" }))
});



//fetch evaluates to a ref to an obj
//then() method is a property of that object & contains a ref to a fct
//this fct takes a fct ref as an arg
// fetch("https://wry-certain-date.glitch.me/signup").then( ()=>{
//   console.log("HTTP response received")
// })



//  // 3-CREATE ENDPOINT path: /create-channel  method: POST 
// app.post("/create-channel", (req, res) => {}
//  channelName 
// // if success
// // if token header missing
// // if token is invalid
// // if the channelName property is missing from the request body
// // If a channel with the same name already exists




  


// // 4-CREATE ENDPOINT path:/join-channel method: POST 
// // if success
// // if token header missing
// // if token is invalid
// // If a user has already joined the channel
// // If a user is banned from the channel


//  // 5-CREATE ENDPOINT path:/leave-channel method: POST 
// // if success
// // if token header missing
// // if token is invalid
// // If the channelName property is missing from the request body; channelName field missing
// // If a channel does not exist
// // If a user hadn't joined the channel



// // 6-CREATE ENDPOINT path:/joined method: GET 
// // if success
// // If the channel doesn't exist
// // if user is not part of this channel
// // If the channel doesn't exist
// // channelName field missing


// // 7-CREATE ENDPOINT path:/delete method: POST 
// // if success (only the person who created the channel can  delete it)
// // if token header missing
// // if token is invalid
// // If the channelName property is missing from the request body; channelName field missing


// // 8-CREATE ENDPOINT path:/kick  method: POST 
// // if success
// // if token header missing
// // if token is invalid
// // If the channelName property is missing from the request body; channelName field missing
// // If the target  property is missing from the request body; target  field missing
// // If the user associated with the token did not create the channel; Channel not owned by user


// // 9-CREATE ENDPOINT path:/ban  method: POST 
// // if success
// // if token header missing
// // if token is invalid
// // If the channelName property is missing from the request body; channelName field missing
// // If the target  property is missing from the request body; target  field missing
// // If the user associate with the token did not create the channel; Channel not owned by user


// // 10-CREATE ENDPOINT path:/message  method: POST 
// // if success
// // if token header missing
// // if token is invalid
// // If the user is not a part of that channel;User is not part of this channel
// // If the channelName property is missing from the request body; channelName field missing
// // If the contents property is missing from the request body;contents field missing



// // 11-CREATE ENDPOINT path:/messages  method: GET 
// // if success; messages in order
// // If the channel doesn't exist;,"reason":"Channel does not exist"
// // If the channelName query parameter is missing;{"success":false,"reason":"channelName field is missing"}
// // The user have joined the channel to get the list of messages;,"reason":"User is not part of this channel"}





 // console.log(JSON.stringify(result))
 // res.send("you logged in as " + JSON.stringify(result))
  // });
         
         
         
// // our default array of dreams
// const dreams = [
//   "Find and count some sheep",
//   "Climb a really tall mountain",
//   "Wash the dishes"
// ];

// // make all the files in 'public' available
// // https://expressjs.com/en/starter/static-files.html
// app.use(express.static("public"));

// // https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

// // send the default array of dreams to the webpage
// app.get("/dreams", (request, response) => {
//   // express helps us take JS objects and send them as JSON
//   response.json(dreams);
// });

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
