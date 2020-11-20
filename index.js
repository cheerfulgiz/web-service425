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


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });

//app.listen(process.env.port || 3000)
//type in browser localhost:3000 or http://192.168.0.122:3000/
//under NPM, click on start=> it will give me the port nber "Your app is listening on port 53263" 
