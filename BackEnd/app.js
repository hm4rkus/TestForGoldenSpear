const express = require('express')
var bodyParser = require('body-parser');
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const crc = require('node-crc');



const app = express()
const port = 9000
const route = '/api'

//EXPRESS CONFIG

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();

})


//DATABASE CONFIG

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb+srv://garciapenchemarc:123123123@cluster0-9ilqp.mongodb.net/test?retryWrites=true&w=majority';

// Database Name
const dbName = 'goldenSpearTest';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
var databaseConnection;

// Use connect method to connect to the Server

client.connect(async function (err, dbR) {

  if (err) throw err;
  databaseConnection = dbR.db(dbName);

});




function verifyToken(req, res, next) {

  let token = req.header('Authorization');
  jwt.verify(token, "abcabc", (err, data) => {
    if (err)
      res.status(403).send({ succes: false, message: "You are not authorized" })
    else {
      next();
    }

  })
}

function decimalOfcrc8(message) {

  let hexa = crc.crc8(Buffer.from(message, 'utf8')).toString('hex');
  return parseInt("0x" + hexa);
}


function caesarCipher(message, shift) {


  let output = "";
  let abc = "abcdefghijklmnopqrstuvwxyz"
  message = message.toLowerCase();

  for (let charIndex in message) {
    let char = message[charIndex];
    let i = abc.indexOf(char);
    if (i != -1) {
      output += abc.charAt((i + shift) % 26);
    }
    else
      output += char;
  }

  return output;


}

function caesarUncipher(message, shift) {


  let output = "";
  let abc = "abcdefghijklmnopqrstuvwxyz"
  let unshift = ((26 - shift) % 26);
  unshift = Math.sqrt(unshift * unshift);
  message = message.toLowerCase();

  for (let charIndex in message) {
    let char = message[charIndex];
    let i = abc.indexOf(char);
    if (i != -1) {
      output += abc.charAt((i - unshift + 26) % 26);
    }
    else
      output += char;
  }

  return output;


}


//ROUTES
app.get('/', verifyToken, (req, res) => res.send('Hello World!'))

app.get(route + '/user/testToken', (req, res) => {
  let token = req.header('Authorization');
  let decr = verifyToken(token, res);
  res.send({ decrypted: decr });

})


app.post(route + '/user/login', (req, res) => {
  let body = req.body;

  if (!body.username || !body.password)
    res.status(400).send({ success: false, message: "Bad request" })


  databaseConnection.collection("Users").findOne({ username: body.username }, function (err, response) {
    if (err) console.log(err);

    if (response) {
      let encryptedPassword = CryptoJS.SHA3(body.password).toString();
      if (response.password === encryptedPassword) {
        jwt.sign(response, "abcabc", { expiresIn: "2h" }, (err, token) => {
          if (err) throw err;
          res.send({ success: true, message: { username: response.username }, token: token })
        })
      }

      else res.send({ success: false, message: "Wrong password" })
    }
    else res.send({ success: false, message: "User does not exist" })
  })


})

app.post(route + "/message", verifyToken, async (req, res) => {

  let body = req.body;

  if (!body.message)
    res.status(400).send({ success: false, message: "Bad request" })

  let count = await databaseConnection.collection("Messages").find().count();

  if (count === 0) {

    databaseConnection.collection("Messages").insertOne({ message: body.message.toLowerCase(), crc: decimalOfcrc8(body.message) });
    res.send({ success: true, result:{decrypted: body.message.toLowerCase(), encrypted: body.message.toLowerCase() } })

  }

  else {

    var previousCrc = 0;
    let currentCrc = decimalOfcrc8(body.message);
    await databaseConnection.collection("Messages").find().forEach(function (document) {
      previousCrc += document.crc;
    });

    let chiphered = caesarCipher(body.message, previousCrc);
    databaseConnection.collection("Messages").insertOne({ message: chiphered, crc: decimalOfcrc8(body.message) });
    res.send({ success: true, result:{decrypted: body.message.toLowerCase(), encrypted: chiphered } })



  }


  /*
databaseConnection.collection("Messages").insertOne({message: message}, function (err) {
  if (err) throw err;
  console.log("Message inserted");
  res.send({ success: true })

});
*/
})


app.get(route + "/message", verifyToken, async (req, res) => {
  let messages = []
  let currentCrc = 0;
  await databaseConnection.collection("Messages").find().forEach(function (document) {
    messages.push({decrypted: caesarUncipher(document.message, currentCrc), encrypted: document.message });
    currentCrc += document.crc;

  })

  res.send({success: true, result: messages })
})

app.post(route + '/user/signup', async (req, res) => {
  let body = req.body;

  if (!body.username || !body.password)
    res.status(400).send({ success: false, message: "Bad request" })

  let encryptedPassword = CryptoJS.SHA3(body.password);


  let foundUsername = await databaseConnection.collection("Users").find({ username: body.username }).count();

  if (foundUsername == 0) {
    databaseConnection.collection("Users").insertOne({ username: body.username, password: encryptedPassword.toString() }, function (err) {
      if (err) throw err;
      console.log("document inserted");
      res.send({ success: true })

    });
  } else {
    console.log("user already exists");
    res.send({ success: false, message: "User already exists" });

  }

})



//START SERVER FUNCTION
async function startServer() {

  app.listen(port, (err) => {
    console.log(`Listening on port ${port}!`);
  })

}




startServer();
