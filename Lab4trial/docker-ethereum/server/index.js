const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');
const contractAPIRoutes = require("./routes/contract-API");
const smartContractAPIRoutes = require("./routes/smart-contract-API");

const port = 4000;
const dbURI = 'mongodb://root:password@mongodb:27017/docker_db';
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        limit:"50mb",
        extended:false,
        parameterLimit:50000    
    })
);

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, auth: {username: 'root', password: 'password'}, authSource: 'admin' });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('Connected to DB'); });


// use the routes specified in route folder
app.use("/", contractAPIRoutes);
app.use("/",smartContractAPIRoutes);


app.use(function(err, req,res, next){
    res.status(422).send({error: err.message});
});

//listen to the server
app.listen( port, function(){
    console.log(`Listening to the port ${port} .....`);
});