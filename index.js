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
app.use(cors());+

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

let users = new Map();//users.set(username, password)
users.set("Eric", "xxx2131");
users.set("bob", "xxx2131");
users.set("playerName", "11111");


//generate a new token on each new login or user connection or session
let genUniqueToken = () => {
  // console.log("generating a random Token = " + Math.floor(Math.random() * 1000000000000))
  return "" + Math.floor(Math.random() * 1000000000000);
};

// let userLoggedIn

//let users = new Map();//users.set(username, password)-ok
let tokenUser = new Map(); //tokenUser.set(uniqueToken, username);-ok
let OwnerChannel = new Map(); //creator of the channel//////OwnerChannel.set(username , channelName)ok
let channelUsers = new Map(); //users logging to same channel//channelUsers.set( username, channelName) ok
let channelBannedUser = new Map();

//what is the best way to set info to map????JAY in the last else
//1-CREATE ENDPOINT /signup TO  create USER ACCOUNT
app.post("/signup", (req, res) => {
  console.log("----------/POST /signup------------");
  // //console.log(
  //   "♣-this is the body request (req.body)in JSON formatted string: " +
  //     req.body +
  //     " //" +
  //     typeof req.body
  // );
console.log("users before new signup::", users)
  let parsedBody = JSON.parse(req.body);
  let result = parsedBody.username + " " + parsedBody.password; //bob xxx2131
  let userName = JSON.parse(req.body).username;
  let passWord = JSON.parse(req.body).password;

  // console.log(
  //   "♣-users.has(userName) is " + users.has(userName) + " // " + typeof userName
  // ); //true string
  //console.log(    "♣-users.has(result) is " + users.has(result) + " // " + typeof result
  //); //false string
  //console.log( "♣-users.has(parsedBody) is " + users.has(parsedBody) +" // " +   typeof parsedBody  ); //false object

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
    //if no problems
    // users.set(userName, {"password": passWord})//!!!!bob  !!!!box
    //users.set(username, password)
    users.set(parsedBody.username, parsedBody.password); //ok
    //users.set(result)//does not set the results, I couldn't access user in next endpoint
    let itemIds = Array.from(users.keys());
    for (let i = 0; i < itemIds.length; i++) {
      console.log("♦" + itemIds[i]); //ok prints all users  ♦creatorOfChannel ♦boby♦player♦AAA♦BBB♦bob♦Lucas
    }
    console.log("users after new signup::", users)
    return res.send(JSON.stringify({ success: true }));
  }
});

//2-CREATE ENDPOINT /login
//users.get(userName).password
app.post("/login", (req, res) => {
  // 1-some console to check
  console.log("------------------POST /login--------------------");
  //console.log( "this is the body request (req.body) in JSON formatted string: " + req.body + " //"  +   typeof req.body
  //);

  let parsedBody = JSON.parse(req.body);
  let result = parsedBody.username + " " + parsedBody.password; //bob xxx2131
  //let userName = JSON.parse(req.body).username
  //let passWord = JSON.parse(req.body).password

  let usr = parsedBody.username;
  //console.log("♦usr = " + usr + ", does map has this usr?? " + users.has(usr)); //false
  let actualUserPass = parsedBody.password;
  //console.log("♣actualUserPass = " + actualUserPass);
  let expectedUserPass = users.get(usr);
  //console.log("♠expectedUserPass = " + expectedUserPass);

  if (!usr) {
    //console.log("♠♠parsedBody.username is " + parsedBody.username);
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
    //console.log("♦♦checking if actualUserPass ?== expectedUserPass => " +  actualUserPass +    "===" +   expectedUserPass    );
    let uniqueToken = genUniqueToken();
    tokenUser.set(uniqueToken, parsedBody.username);
    //console.log("tokenUser::", tokenUser)
    // userLoggedIn = parsedBody.username
    res.send(JSON.stringify({ success: true, token: uniqueToken }));
    return;
  }
  //3-Invalid password ok
  else if (users.has(usr) && actualUserPass !== expectedUserPass) {
    //console.log(  "♣♣usr = " + usr + ", does map has this usr?? " + users.has(usr)    );
    //console.log(  "♣♣checking if actualUserPass ?== expectedUserPass => " +       actualUserPass +   "!==" +  expectedUserPass    );
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

// 3-CREATE ENDPOINT path: /create-channel  method: POST
app.post("/create-channel", (req, res) => {
  let parsedBody = JSON.parse(req.body);
  let channelSeLLama = parsedBody.channelName;

  //1-some console.log to check
  console.log("----------begin POST /create-channel------------");
  // console.log("parsedBody:: ", parsedBody, typeof parsedBody); // { channelName: 'freeeze' }
  // console.log("req.headers.token:: ", req.headers.token); //779378897775
  // console.log("tokenUser:: ", tokenUser); //Map { '779378897775' => 'boby' }
  // console.log(
  //   "!tokenUser.has(req.headers.token:: )",
  //   !tokenUser.has(req.headers.token)
  // ); //false
  // console.log("channelSeLLama:: ", channelSeLLama); //freeeze
 
  //if token is missing in the header
  if (!req.headers.token) {
    return res.send(
      JSON.stringify({ success: false, reason: "token field missing" })
    );
  } else if (!tokenUser.has(req.headers.token)) {
    return res.send(
      JSON.stringify({ success: false, reason: "Invalid token" })
    );
  } else if (!parsedBody.channelName) {
    return res.send(
      JSON.stringify({ success: false, reason: "channelName field missing" })
    );
  } else if (
    Array.from(OwnerChannel.values()).includes(parsedBody.channelName)
  ) {
    return res.send(
      JSON.stringify({ success: false, reason: "Channel already exists" })
    );
  }

  //OwnerChannel.set(username , channelName)ok
  OwnerChannel.set(tokenUser.get(req.headers.token), parsedBody.channelName);
   
  console.log("OwnerChannel:: ", OwnerChannel); //Map { 'boby' => 'freeeze' }
  //console.log(OwnerChannel.size); 
  console.log("OwnerChannel.keys:: ", OwnerChannel.keys());
  console.log("OwnerChannel.values:: ", OwnerChannel.values()); // [Map Iterator] { 'bbb', 'freeeze' }
  // console.log("Array.from(OwnerChannel.values())::", Array.from(OwnerChannel.values()))//[]
  for (let chanelName of OwnerChannel.values()) {
    console.log(chanelName); //freeeze bbb
  }
   console.log("tokenUser as in token per session::", tokenUser)
    console.log("OwnerChannel::", OwnerChannel)
    console.log("channelUsers::", channelUsers)
  // channelUsers.set(parsedBody.channelName, tokenUser.get(req.headers.token));
  return res.send(JSON.stringify({ success: true }));
});

//----------------------------------------------------------------
// 4-CREATE ENDPOINT path:/join-channel method: POST
app.post("/join-channel", (req, res) => {
  let parsedBody = JSON.parse(req.body);
  let channelSeLLama = parsedBody.channelName;

  //1-some console.log to check
  console.log("-----------begin POST /join-channel-----------");
  // console.log("parsedBody:: ", parsedBody, typeof parsedBody); //{ channelName: 'freeeeeze' } object
  // console.log( "req.headers.token:: ",req.headers.token, typeof req.headers.token ); // string

  if (!req.headers.token) {
    return res.send(
      JSON.stringify({ success: false, reason: "token field missing" })
    );
  } else if (!tokenUser.has(req.headers.token)) {
    return res.send(
      JSON.stringify({ success: false, reason: "Invalid token" })
    );
  } else if (!parsedBody.channelName) {
    return res.send(
      JSON.stringify({ success: false, reason: "channelName field missing" })
    );
  } else if (
    !Array.from(OwnerChannel.values()).includes(parsedBody.channelName)
  ) {
    return res.send(
      JSON.stringify({ success: false, reason: "Channel does not exist" })
    );
  } else if (channelUsers.has(tokenUser.get(req.headers.token))) {
    return res.send(
      JSON.stringify({ success: false, reason: "User has already joined" })
    );
  } else if (  Array.from(channelBannedUser.values()).includes( tokenUser.get(req.headers.token)  )  ) {
    return res.send(
      JSON.stringify({ success: false, reason: "User is banned" })
    );
  }
  //channelUser.set( username, channelName)
  channelUsers.set(tokenUser.get(req.headers.token), parsedBody.channelName);
 // console.log("♦♦tokenUser.get(req.headers.token)::", tokenUser.get(req.headers.token))//Eric
  //channelUsers.set( parsedBody.channelName, tokenUser.get(req.headers.token));
  for (let cc of channelUsers.values()) {
    console.log("♦", cc); //freeeeeze
  }
    console.log("tokenUser as in token per session::", tokenUser)
    console.log("OwnerChannel::", OwnerChannel)
    console.log("channelUsers::", channelUsers)

  return res.send(JSON.stringify({ success: true }));
});

//----------------------------------------------------------------------------
//  // 5-CREATE ENDPOINT path:/leave-channel method: POST
app.post("/leave-channel", (req, res) => {
  let parsedBody = JSON.parse(req.body);
  let channelSeLLama = parsedBody.channelName;

  //1-some console.log to check
  console.log("-----------begin POST /leave-channel-----------");
  console.log("parsedBody:: ", parsedBody, typeof parsedBody); // { channelName: 'freeeze' }
  console.log("req.headers.token:: ", req.headers.token); //779378897775
  console.log("tokenUser:: ", tokenUser); //Map { '779378897775' => 'boby' }
  console.log(
    "!tokenUser.has(req.headers.token:: )",
    !tokenUser.has(req.headers.token)
  ); //false
  console.log("channelSeLLama:: ", channelSeLLama); //freeeze
  console.log("OwnerChannel.values:: ", OwnerChannel.values()); // [Map Iterator] {  }
  // console.log("Array.from(OwnerChannel.values())::", Array.from(OwnerChannel.values()))//[]

  if (!req.headers.token) {
    return res.send(
      JSON.stringify({ success: false, reason: "token field missing" })
    );
  } else if (!tokenUser.has(req.headers.token)) {
    return res.send(
      JSON.stringify({ success: false, reason: "Invalid token" })
    );
  } else if (!parsedBody.channelName) {
    return res.send(
      JSON.stringify({ success: false, reason: "channelName field missing" })
    );
  } else if (
    !Array.from(OwnerChannel.values()).includes(parsedBody.channelName)
  ) {
    return res.send(
      JSON.stringify({ success: false, reason: "Channel does not exist" })
    );
  } else if (!channelUsers.has(tokenUser.get(req.headers.token))) {
    return res.send(
      JSON.stringify({
        success: false,
        reason: "User is not part of this channel"
      })
    );
  }

  channelUsers.delete(tokenUser.get(req.headers.token));
  
  console.log("tokenUser as in token per session::", tokenUser)
  console.log("OwnerChannel as in owner of channel::", OwnerChannel)
  console.log("channelUsers::", channelUsers)
  return res.send(JSON.stringify({ success: true }));
});



//not sure I need another array , just look at last channelUsers
//let channelNameUsers = new Map() //(channelName, [])

// // 6-CREATE ENDPOINT path:/joined method: GET
app.get("/joined", (req, res) => {
// let parsedBody = JSON.parse(req.body);
// let requestBody = JSON.stringify({ channelName: req.query.channelName,token: req.headers.token, });
  console.log("-----begin get /joined-----------------");

  let joined=[]
  //VERIFY THE CHANNEL NAME from the query
  console.log("req.query.channelName::",req.query.channelName)
  
  //console.log("query param:: ", requestBody); //query param::  {"channelName":"freeeeez","token":"864665999502"}
  //console.log("username:: ", tokenUser.get(req.headers.token))//bob

   //VERIFY THE USERNAME FROM THE SESSION TOKEN
  console.log("tokenUser.get(req.headers.token)::", tokenUser.get(req.headers.token))//Eric
  
  if (!req.headers.token) {
    return res.send( JSON.stringify({ success: false, reason: "token field missing" }) )
    }
  //if token invalid? means? token does not belong to that user?
  else if (!tokenUser.has(req.headers.token)) {
    return res.send(
      JSON.stringify({ success: false, reason: "Invalid token" })
    );
  }
  
  // 2-If the channel doesn't exist//ok
  else  if( !Array.from(OwnerChannel.values()).includes(req.query.channelName)     )           {
    console.log("yooooo", OwnerChannel.values())//freeze
    return res.send(  JSON.stringify({ success: false, reason: "Channel does not exist" }) );
  }
//   else if(!OwnerChannel.has(req.query.channelName)){
//     console.log(' if OwnerChannel.has(req.query.channelName)', OwnerChannel.has(req.query.channelName))
//     console.log("Channel does not exist")

//   }
  // 3-if user is not part of this channel//ok
 else if( !channelUsers.has(tokenUser.get(req.headers.token)) ){
    console.log('if channelUsers.has(tokenUser.get(req.headers.token))::', channelUsers.has(tokenUser.get(req.headers.token)))
    console.log("user NOT is in this channel=> user is not part of this channel")//ok
    return res.send(    JSON.stringify({success: false, reason: "User is not part of this channel" })      );
  
 }    
 //1-if success
  else{
    //CHECKING what is in tokenUser map
    //console.log(  "Array.from(tokenUser::", Array.from(tokenUser) )
 
    let a = Array.from(channelUsers.keys())
    let channelName = req.query.channelName
    let b = Array.from(channelUsers.values())
    for(let i = 0; i<a.length; i++){
      console.log(b[i])//ok
      if(b[i] === req.query.channelName){
          joined.push(a[i])
      }
      console.log("**joined::",joined)

      }
  
  // channelUsers.delete(userTtokenUseroken.get(req.headers.token));
  console.log("tokenUser as in session::", tokenUser)
  console.log("OwnerChannel::", OwnerChannel)
  console.log("channelUsers::", channelUsers)

  return res.send( JSON.stringify({ success: true, joined }) );
  }
  });

 // 7-CREATE ENDPOINT path:/delete method: POST
app.post("/delete", (req, res) => {

  let parsedBody = JSON.parse(req.body);
  //let requestBody = JSON.stringify({ channelName: req.query.channelName,token: req.headers.token, });
 // let channelSeLLama = parsedBody.channelName;
  
   console.log("-----begin POST /delete-----------------")
  
  //VERIFY THE CHANNEL NAME //ok 
  console.log("channelName::",parsedBody.channelName)
  
  //verify the token from headers //ok
  console.log("req.headers.token::", req.headers.token)
  
  //VERIFY TO WHOM CORRESPONDS THE SESSION TOKEN, TO WHICH USERNAME
   console.log("username:: ", tokenUser.get(req.headers.token))//bob

 //values before deletion  
  console.log("tokenUser as in session BEFORE DELETION::", tokenUser)
  console.log("OwnerChannel BEFORE DELETION:::", OwnerChannel)
  console.log("channelUsers BEFORE DELETION:::", channelUsers)
  
    
  //token missing
   if (!req.headers.token) {
    return res.send( JSON.stringify({ success: false, reason: "token field missing" }) )
    }
  //if token invalid
  else if (!tokenUser.has(req.headers.token)) {
    return res.send(
      JSON.stringify({ success: false, reason: "Invalid token" })
    );
  }
    else if (!parsedBody.channelName) {
    return res.send(
      JSON.stringify({ success: false, reason: "channelName field missing" })
    )
  }
     //If the channel doesn't exist
  else  if( !Array.from(OwnerChannel.values()).includes(parsedBody.channelName)     )           {
    console.log("yooooo", OwnerChannel.values())//freeze
    return res.send(  JSON.stringify({ success: false, reason: "Channel does not exist" }) );
  }
  
  else{
   
  //iterate throup map OwnerChannel::, FIND THE USer/owner of this channel
  //delete the channel + user/owner
  let a = Array.from(OwnerChannel.keys())
  console.log("Array.from(OwnerChannel.keys())::", Array.from(OwnerChannel.keys()))
  let channelName = parsedBody.channelName
  console.log("channelName::", channelName)
  let b = Array.from(OwnerChannel.values())
  console.log("Array.from(OwnerChannel.values())::",Array.from(OwnerChannel.values()))
  for(let i = 0; i<a.length; i++){
    console.log("@ i::", i,"value or channelName::", b[i])//ok
    if(b[i] === parsedBody.channelName){
      console.log("@ i::",i," b[i]::",b[i], " deleting a[i] && b[i]::", a[i], b[i])
      OwnerChannel.delete(a[i])
      OwnerChannel.delete(b[i])
    }
   console.log("**deleted from OwnerChannel::")
  }
  
  //then I need to delete all users corresponding to that deletes channel from channel Users
   let c = Array.from(channelUsers.keys())
   console.log("Array.from(channelUsers.keys())::", Array.from(channelUsers.keys()))
    //let channelName = parsedBody.channelName
    let  d = Array.from(channelUsers.values())
    console.log("Array.from(channelUsers.values())::",Array.from(channelUsers.values()))
    for(let i = 0; i<c.length; i++){
      console.log(d[i])//ok
      console.log("@ i::", i,"value or channelName::", d[i])
      if(d[i] === parsedBody.channelName){
        console.log("@ i::",i," d[i]::",d[i], " deleting c[i]::", c[i])
        channelUsers.delete(c[i])
      }
      console.log("**deleted from channelUsers::",)

      }
  
  // channelUsers.delete(userTtokenUseroken.get(req.headers.token));
  console.log("tokenUser as in session AFTER DELETION::", tokenUser)
  console.log("OwnerChannel AFTER DELETION::", OwnerChannel)
  console.log("channelUsers AFTER DELETION::", channelUsers)
   return res.send( JSON.stringify({ success: true }) )
  }
  
});


 // 8-CREATE ENDPOINT path:/kick  method: POST
app.post("/kick", (req, res) => {
  console.log("-----begin POST /kick-----------------")
  
  //get the JSON body request (value of the json formatted string represents an object w 2 properties{  "channelName": "freeeze", "target" : "usernameToBeKicked"})
   let parsedBody = JSON.parse(req.body)//{"channelName":"LqEs9wlnfzrEtUA"}
  
   
   //VERIFY THE CHANNEL NAME to be kicked from//ok 
  console.log("channelName::", parsedBody.channelName)//ok LqEs9wlnfzrEtUA
  console.log("-----channel Owner INFO-----------")
  
//   //OWNER TOKEN:verify the token from headers=> then check if this token belongs to the owner of channel //ok
  console.log("req.headers.token::", req.headers.token)//812256774000
  
//   //VERIFY owner of this channel; [TO WHOM CORRESPONDS THE SESSION TOKEN, TO WHICH USERNAME]
    console.log("username/owner :: ", tokenUser.get(req.headers.token))//64QigelHeVEAbrY
  
   console.log("-----USER TO KICK INFO-----------")
  //get the name of the user to kick out from this channel, from the token in body req.
  console.log("target/username  ::", parsedBody.target)//get username/ok DStileNBtRzIh8r
  //target key
  //get its value
 // console.log("tokenUser.get(parsedBody.target)::", tokenUser.get(parsedBody.target))//undefined CANNOT GET THE KEY THIS WAY
  
  //username
  let parsedTarget = parsedBody.target
  let parsedTarget1 = JSON.parse(req.body).target
  console.log("parsedTarget::", parsedTarget, " // parsedBody.target::",parsedBody.target) //DStileNBtRzIh8r   ok
  console.log("parsedTarget1::",parsedTarget1, " // JSON.parse(req.body).target::", JSON.parse(req.body).target)//ok
 
 //values before kicking   
  console.log("tokenUser as in session BEFORE ::", tokenUser)
  console.log("OwnerChannel BEFORE :::", OwnerChannel)
  console.log("channelUsers BEFORE :::", channelUsers)
  
 
   if (!req.headers.token) {
    return res.send( JSON.stringify({ success: false, reason: "token field missing" })
    );
   }
   else if (!tokenUser.has(req.headers.token)) {
    return res.send(  JSON.stringify({ success: false, reason: "Invalid token" })
    );
  }
   else if (!parsedBody.channelName) {
    return res.send( JSON.stringify({ success: false, reason: "channelName field missing" })
    );
  }
  else if(!parsedBody.target){
    return res.send(   JSON.stringify({ success: false, reason: "target field missing" })
    );
    
  }
  
  else if (!OwnerChannel.has(tokenUser.get(req.headers.token))) {
    return res.send(  JSON.stringify({  success: false,  reason: "Channel not owned by user"  })     );
  }
else{
  
  
   //I don't need to get his key
for (let [key, value] of channelUsers) {
console.log("♦",key + ' = ' + value)
if(key===JSON.parse(req.body).target){
        channelUsers.delete(JSON.parse(req.body).target)
}
}
  console.log("tokenUser as in session AFTER ::", tokenUser)
  console.log("OwnerChannel AFTER ::", OwnerChannel)
  console.log("channelUsers AFTER ::", channelUsers)
  
  
  return res.send( JSON.stringify({ success: true }) )
}

 });

// 9-CREATE ENDPOINT path:/ban  method: POST
app.post("/ban", (req, res) => {
  
  console.log("-----begin POST /ban-----------------")
  
  //get the JSON body request (value of the json formatted string represents an object w 2 properties{  "channelName": "freeeze", "target" : "usernameToBeBanned"})
   let parsedBody = JSON.parse(req.body)//{"channelName":" "}
  
   
   //VERIFY THE CHANNEL NAME to be kicked from//ok 
  console.log("channelName::", parsedBody.channelName)//ok
  
  console.log("-----channel Owner INFO-----------")
  
  //OWNER TOKEN:verify the token from headers=> then check if this token belongs to the owner of channel //ok
  console.log("OWNER TOKEN::", req.headers.token)//ok
  
 //VERIFY if token belongs to owner of this channel; 
  console.log("username of owner :: ", tokenUser.get(req.headers.token))//ok
  
  //verify if username is really owner
  console.log("if usr is owner::",OwnerChannel.get(tokenUser.get(req.headers.token)))//UNDEFINED
  console.log("*if usr is owner::",OwnerChannel.has(tokenUser.get(req.headers.token)))
  //OwnerChannel.has(tokenUser.get(req.headers.token))
  console.log("***if usr is owner::", Array.from(OwnerChannel.values()).includes( tokenUser.get(req.headers.token)  ) )
  
   console.log("-----USER TO BAN INFO-----------")
  //get the name of the user to ban from this channel, 
  console.log("target/username  ::", parsedBody.target)//get username ok
   //username
  let parsedTarget = parsedBody.target
  let parsedTarget1 = JSON.parse(req.body).target
  console.log("parsedTarget::", parsedTarget, " // parsedBody.target::",parsedBody.target) //DStileNBtRzIh8r   ok
  console.log("parsedTarget1::",parsedTarget1, " // JSON.parse(req.body).target::", JSON.parse(req.body).target)//ok
     
 //values before kicking   
  console.log("tokenUser as in session BEFORE ::", tokenUser)
  console.log("OwnerChannel BEFORE :::", OwnerChannel)
  console.log("channelUsers BEFORE :::", channelUsers)
  console.log("channelBannedUser BEFORE::", channelBannedUser)
  
  if (!req.headers.token) {
    return res.send( JSON.stringify({ success: false, reason: "token field missing" })
    );
   }
   else if (!tokenUser.has(req.headers.token)) {
    return res.send(  JSON.stringify({ success: false, reason: "Invalid token" })
    );
  }
   else if (!parsedBody.channelName) {
    return res.send( JSON.stringify({ success: false, reason: "channelName field missing" })
    );
  }
  else if(!parsedBody.target){
    return res.send(   JSON.stringify({ success: false, reason: "target field missing" })
    );
    
  }
  
  else if (!OwnerChannel.has(tokenUser.get(req.headers.token))) {
    return res.send(  JSON.stringify({  success: false,  reason: "Channel not owned by user"  })     );
  }
else{
  
 // channelBannedUser.set("channelName", username")
  channelBannedUser.set(parsedBody.channelName, parsedBody.target)
  
  //values After Banning   
  console.log("tokenUser as in session AFTER ::", tokenUser)
  console.log("OwnerChannel AFTER :::", OwnerChannel)
  console.log("channelUsers AFTER :::", channelUsers)
  console.log("channelBannedUser AFTER::", channelBannedUser)
  
  return res.send( JSON.stringify({ success: true }) )
}
  
});


app.post("/message", (req, res) => {
  console.log("-----begin POST /message-----------------")
   //get the JSON body request (value of the json formatted string represents an object w 2 properties{  "channelName": "freeeze", "contents" : "youuhou"})
   let parsedBody = JSON.parse(req.body)
   console.log("parsedBody::", parsedBody)
    
  //get the content
  console.log("contents::", parsedBody.contents)
  console.log("JSON.stringify(contents)::", JSON.stringify(parsedBody.contents))
  
  
 //VERIFY THE CHANNEL NAME to be kicked from//
  console.log("channelName::", parsedBody.channelName)
    
  //verify the token from headers=> then check if this token belongs to the owner of channel //
  console.log("req.headers.token::", req.headers.token)
    
 //values before deletion  
  console.log("tokenUser as in session BEFORE ::", tokenUser)
  console.log("OwnerChannel BEFORE :::", OwnerChannel)
  console.log("channelUsers BEFORE :::", channelUsers)
  
  
   if (!req.headers.token) {
    return res.send(
      JSON.stringify({ success: false, reason: "token field missing" })
    );
  } else if (!tokenUser.has(req.headers.token)) {
    return res.send(
      JSON.stringify({ success: false, reason: "Invalid token" })
    );
  }   else if( !channelUsers.has(tokenUser.get(req.headers.token)) ){
        return res.send(    JSON.stringify({success: false, reason: "User is not part of this channel" })      );
  
 } else if (!parsedBody.channelName) {
    return res.send(
      JSON.stringify({ success: false, reason: "channelName field missing" })
    )
  }  else if(!parsedBody.contents){
    return res.send(   JSON.stringify({ success: false, reason: "contents field missing" })
    );
    
  }
  
  //PROBLEM=> ONCE USER IS KICKED OUT, HE SHOULD NOT APPEAR TO BE JOINED, SO 
    
  // else  if( !Array.from(OwnerChannel.values()).includes(parsedBody.channelName)     )           {
  //    return res.send(  JSON.stringify({ success: false, reason: "Channel does not exist" }) );
  // }
  
  
  console.log("tokenUser as in session AFTER ::", tokenUser)
  console.log("OwnerChannel AFTER ::", OwnerChannel)
  console.log("channelUsers AFTER ::", channelUsers)
  return res.send( JSON.stringify({ success: true }) )
    
  });


// // 11-CREATE ENDPOINT path:/messages  method: GET
// // if success; messages in order
// // If the channel doesn't exist;,"reason":"Channel does not exist"
// // If the channelName query parameter is missing;{"success":false,"reason":"channelName field is missing"}
// // The user have joined the channel to get the list of messages;,"reason":"User is not part of this channel"}

app.get("/messages", (req, res) => {
   console.log("-----begin get /messages-----------------")
  //every time the login endpoint is calles=>add the message to the username
  // /message: header token of username, body req {"channelName":"freeeze", "contents ":"houhou"}
  
  //fetch=>?
    
});







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
