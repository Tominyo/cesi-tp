// server.js
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express();
const birds = require('./routes/apiRoutes')

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials : true
 }

 //Les Middlewares
app.use(express.json()); //Middleware TOUJOURS TOUT EN HAUT
app.use(bodyParser.urlencoded()); // IMPORTANT !!  pour les requètes etc JSON()
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(cors(corsOptions));

app.options('*', cors()) // include before other routes

//Les routes
app.use('/', birds)

// NEW UPLOAD
app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});  