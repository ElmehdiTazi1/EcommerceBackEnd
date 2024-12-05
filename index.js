const express = require("express");
const app = express();
require("dotenv").config();
const clientRoute = require("./routes/api/clientRoute");
const commandeRoute = require("./routes/api/commandeRoute");
const produitRoute = require("./routes/api/produitRoute");
const categorieRoute = require("./routes/api/categorieRoute");
const fournisseurRoute= require("./routes/fournisseurRoute");
const bodyParser = require('body-parser')
const formidable =require('express-formidable')
const cookieParser = require('cookie-parser');
app.set('view engine', 'ejs');
const cors = require('cors');
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);



const corsOptions = {
    origin: "*",
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-reset-token', 'x-invite-token', 'x-access-token', 'x-api-key', 'x-www-form-urlencoded','code'],
    credentials: true
};
app.use(cookieParser());
//app.use(cors(corsOptions));

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/api/commandes', commandeRoute);
app.use('/api/clients', clientRoute);
app.use('/', fournisseurRoute);
app.use('/api/produits', produitRoute);
app.use('/api/categories', categorieRoute);



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});