//FinalProjectPart1
//ERRORS=> app.use(cors) INSTEAD OF app.use(cors());
//ERRORS=> app.use(cookieParser) INSTEAD OF app.use(cookieParser())
//parsedBody.password === undefined) INSTEAD OF parsedBody.password === "")
//not changing  from postman the appropriate method (GET or POST...)
//lost in the map()

const express = require("express");
const app = express();

let morgan = require("morgan");
app.use(morgan("combined"));

let bodyParser = require("body-parser");
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
      .readFileSync(__filename)
      .toString()
  );
});

let users = new Map();
//users.set("username", "bob2131");
users.set("bob", "xxx2131");
users.set("boby", "xxx2131");
//users.set({"username":"bob", "password":"xxx2131"});
//users.set({"username":"bob1","password":"pwd123"} )
//{"username":"box", "password":"box213x"}//JSON
//{"username":"AAA","password":"AAA123"}

//generate a new token on each new login or user connection or session
let genUniqueToken = () => {
  // console.log("generating a random Token = " + Math.floor(Math.random() * 1000000000000))
  return "" + Math.floor(Math.random() * 1000000000000);
};

// let tokens = new Map();

// let userLoggedIn

let userToken = new Map();
let userChannel = new Map();
let channelUser = new Map();
let channelBannedUser = new Map();

//what is the best way to set info to map????JAY in the last else
//1-CREATE ENDPOINT /signup TO  create USER ACCOUNT
app.post("/signup", (req, res) => {
  console.log(
    "♣-this is the body request (req.body)in JSON formatted string: " +
      req.body +
      " //" +
      typeof req.body
  );

  let parsedBody = JSON.parse(req.body);
  let result = parsedBody.username + " " + parsedBody.password; //bob xxx2131
  let userName = JSON.parse(req.body).username;
  let passWord = JSON.parse(req.body).password;

  console.log(
    "♣-users.has(userName) is " + users.has(userName) + " // " + typeof userName
  ); //true string
  console.log(
    "♣-users.has(result) is " + users.has(result) + " // " + typeof result
  ); //false string
  console.log(
    "♣-users.has(parsedBody) is " +
      users.has(parsedBody) +
      " // " +
      typeof parsedBody
  ); //false object

  if (users.has(userName)) {
    //Username exists
    return res.send(
      JSON.stringify({ success: false, reason: "Username exists" })
    );
  } else if (userName === undefined) {
    // if (parsedBody.username === undefined)
    console.log("♦userName === undefined)" + parsedBody.username);
    return res.send(
      JSON.stringify({ success: false, reason: "username field missing" })
    );
  } else if (passWord === undefined) {
    //if password field missing
    return res.send(
      JSON.stringify({ success: false, reason: "password field missing" })
    );
  } else {
    //of no problems
    // users.set(userName, {"password": passWord})//!!!!bob  !!!!box
    users.set(parsedBody.username, parsedBody.password); //ok
    //users.set(result)//does not set the results, I couldn't access user in next endpoint
    let itemIds = Array.from(users.keys());
    for (let i = 0; i < itemIds.length; i++) {
      console.log("♦" + itemIds[i]); //ok
    }
    return res.send(JSON.stringify({ success: true }));
  }
});

//2-CREATE ENDPOINT /login
//users.get(userName).password
app.post("/login", (req, res) => {
  // 1-some console to check
  console.log(
    "1-this is the body request (req.body) in JSON formatted string: " +
      req.body +
      ", typeof(req.body) is " +
      typeof req.body
  );

  let parsedBody = JSON.parse(req.body);
  let result = parsedBody.username + " " + parsedBody.password; //bob xxx2131
  // let userName = JSON.parse(req.body).username
  //let passWord = JSON.parse(req.body).password

  let usr = parsedBody.username;
  console.log("♦usr = " + usr + ", does map has this usr?? " + users.has(usr)); //false
  let actualUserPass = parsedBody.password;
  console.log("♣actualUserPass = " + actualUserPass);
  let expectedUserPass = users.get(usr);
  console.log("♠expectedUserPass = " + expectedUserPass);

  if (!usr) {
    console.log("♠♠parsedBody.username is " + parsedBody.username);
    return res.send(
      JSON.stringify({ success: false, reason: "username field missing" })
    );
  }
  //4-password field missing prob
  else if (!actualUserPass) {
    res.send(
      JSON.stringify({ success: false, reason: "password field missing" })
    );
  }
  //1-success If a user has signed up
  else if (users.has(usr) && actualUserPass === expectedUserPass) {
    // (actualUserPass === expectedUserPass && actualUserPass !== undefined) {
    console.log(
      "♦♦checking if actualUserPass ?== expectedUserPass => " +
        actualUserPass +
        "===" +
        expectedUserPass
    );
    let uniqueToken = genUniqueToken();
    userToken.set(uniqueToken, parsedBody.username);
    // userLoggedIn = parsedBody.username
    res.send(JSON.stringify({ success: true, token: uniqueToken }));
    return;
  }
  //3-Invalid password ok
  else if (users.has(usr) && actualUserPass !== expectedUserPass) {
    console.log(
      "♣♣usr = " + usr + ", does map has this usr?? " + users.has(usr)
    );
    console.log(
      "♣♣checking if actualUserPass ?== expectedUserPass => " +
        actualUserPass +
        "!==" +
        expectedUserPass
    );
    return res.send(
      JSON.stringify({ success: false, reason: "Invalid password" })
    );
  } else if (users.has(usr) && actualUserPass === undefined) {
    return res.send(
      JSON.stringify({ success: false, reason: "password field missing" })
    );
  }
  //5-username field missing ok
  else if (!users.has(usr)) {
    return res.send(
      JSON.stringify({ success: false, reason: "User does not exist" })
    );
  }
  //2- user does not exist
  else
    return res.send(
      JSON.stringify({ success: false, reason: "User does not exist" })
    );
});

//same password as bob but with a new username=> answer should be that username does not exist instead of password field missing
//{"anne", "xxx2131"}

//  // 3-CREATE ENDPOINT path: /create-channel  method: POST

//req.headers.get("token")
app.post("/create-channel", (req, res) => {
  let parsedBody = JSON.parse(req.body);
  if (!req.headers.token) {
    return res.send(
      JSON.stringify({ success: false, reason: "token field missing" })
    );
  } else if (!userToken.has(req.headers.token)) {
    return res.send(
      JSON.stringify({ success: false, reason: "Invalid token" })
    );
  } else if (!parsedBody.channelName) {
    return res.send(
      JSON.stringify({ success: false, reason: "channelName field missing" })
    );
  } else if (
    Array.from(userChannel.values()).includes(parsedBody.channelName)
  ) {
    return res.send(
      JSON.stringify({ success: false, reason: "Channel already exists" })
    );
  }
  userChannel.set(userToken.get(req.headers.token), parsedBody.channelName);
  // channelUser.set(parsedBody.channelName, userToken.get(req.headers.token));
  return res.send(JSON.stringify({ success: true }));
});

// 4-CREATE ENDPOINT path:/join-channel method: POST

app.post("/join-channel", (req, res) => {
  let parsedBody = JSON.parse(req.body);

  if (!req.headers.token) {
    return res.send(
      JSON.stringify({ success: false, reason: "token field missing" })
    );
  } else if (!userToken.has(req.headers.token)) {
    return res.send(
      JSON.stringify({ success: false, reason: "Invalid token" })
    );
  } else if (!parsedBody.channelName) {
    return res.send(
      JSON.stringify({ success: false, reason: "channelName field missing" })
    );
  } else if (
    !Array.from(userChannel.values()).includes(parsedBody.channelName)
  ) {
    return res.send(
      JSON.stringify({ success: false, reason: "Channel does not exist" })
    );
  } else if (channelUser.has(userToken.get(req.headers.token))) {
    return res.send(
      JSON.stringify({ success: false, reason: "User has already joined" })
    );
  } else if (
    Array.from(channelBannedUser.values()).includes(
      userToken.get(req.headers.token)
    )
  ) {
    return res.send(
      JSON.stringify({ success: false, reason: "User is banned" })
    );
  }

  channelUser.set(userToken.get(req.headers.token), parsedBody.channelName);

  return res.send(JSON.stringify({ success: true }));
});

//  // 5-CREATE ENDPOINT path:/leave-channel method: POST
app.post("/leave-channel", (req, res) => {
  let parsedBody = JSON.parse(req.body);

  if (!req.headers.token) {
    return res.send(
      JSON.stringify({ success: false, reason: "token field missing" })
    );
  } else if (!userToken.has(req.headers.token)) {
    return res.send(
      JSON.stringify({ success: false, reason: "Invalid token" })
    );
  } else if (!parsedBody.channelName) {
    return res.send(
      JSON.stringify({ success: false, reason: "channelName field missing" })
    );
  } else if (
    !Array.from(userChannel.values()).includes(parsedBody.channelName)
  ) {
    return res.send(
      JSON.stringify({ success: false, reason: "Channel does not exist" })
    );
  } else if (
    !channelUser.has(userToken.get(req.headers.token))
  ) {
    return res.send(
      JSON.stringify({
        success: false,
        reason: "User is not part of this channel"
      })
    );
  }

  channelUser.delete(userToken.get(req.headers.token));

  return res.send(JSON.stringify({ success: true }));
});

// 6-CREATE ENDPOINT path:/joined method: GET
app.get("/joined", (req, res) => {
//  let parsedBody = JSON.parse(req.body);
  let requestBody = JSON.stringify({
    channelName: [req.query.channelName],
    target: req.query.lang
  });

  console.log('query param:: ', requestBody)
//   if (!req.headers.token) {
//     return res.send(
//       JSON.stringify({ success: false, reason: "token field missing" })
//     );
//   } else if (!userToken.has(req.headers.token)) {
//     return res.send(
//       JSON.stringify({ success: false, reason: "Invalid token" })
//     );
//   } else if (!parsedBody.channelName) {
//     return res.send(
//       JSON.stringify({ success: false, reason: "channelName field missing" })
//     );
//   } else if (
//     !Array.from(userChannel.values()).includes(parsedBody.channelName)
//   ) {
//     return res.send(
//       JSON.stringify({ success: false, reason: "Channel does not exist" })
//     );
//   } else if (
//     !channelUser.has(userToken.get(req.headers.token))
//   ) {
//     return res.send(
//       JSON.stringify({
//         success: false,
//         reason: "User is not part of this channel"
//       })
//     );
//   }

//   channelUser.delete(userToken.get(req.headers.token));

  return res.send(JSON.stringify({ success: true }));
});

// if success
// If the channel doesn't exist
// if user is not part of this channel
// If the channel doesn't exist
// channelName field missing

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

//app.listen(process.env.port || 3000)
//type in browser localhost:3000 or http://192.168.0.122:3000/
//under NPM, click on start=> it will give me the port nber "Your app is listening on port 53263" 
