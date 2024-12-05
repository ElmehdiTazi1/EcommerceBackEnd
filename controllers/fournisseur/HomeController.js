const Fournisseur = require("../../models/fournisseur");
const Admin = require("../../models/admin");
const Role = require("../../models/role");
const Produit = require("../../models/produit");
const { parentPort,Worker } = require('worker_threads');
const jwt = require("jsonwebtoken")
class homeController {

    static async index(req, res) {


        
let four=await Fournisseur.getFournisseur(req.user.userId) ;
let revenuannuel=0;
let revenuquotidien=0;
let revenumensuel=0;
let revenuavgquotidien=0;
let produitfav=[];
let produitsal=[];
let dataventeyear;
let dataventepermonthyear;
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MAD',
  
  });

  

let promises=[
    four.getMyRevenuThisYear(),
       four.getMyRevenuThisDay(),
       four.getMyRevenuThisMonth(),
       four.getMyTheMostFavorableProduit(),
       four.getMyTheMostSaledProduit(),
       four.getMyRevenuMoyenneThisMonth(),
       four.getMyVentesThisYear(),
       four.getMyVentesPerMonthThisYear()
]

Promise.all(promises).then((resultat)=>{

    produitfav=resultat[3]?resultat[3]:[];
    produitsal=resultat[4]?resultat[4]:[];
    revenuannuel=formatter.format(resultat[0]);
revenuquotidien=formatter.format(resultat[1]);
revenuavgquotidien=formatter.format(resultat[2]/30);
revenumensuel=formatter.format(resultat[2]);

dataventeyear=resultat[6] ? resultat[6]:[] ;
dataventepermonthyear=resultat[7] ? resultat[7]:[] ;

    res.status(200).render('home',{username:req.user.username,dataventepermonthyear:dataventepermonthyear,dataventeyear:dataventeyear,revenuavgquotidien:revenuavgquotidien,produitfav:produitfav,produitsal:produitsal,revenuannuel:revenuannuel,revenuquotidien:revenuquotidien,revenumensuel:revenumensuel});
})
          

        
    }
    

   
    

}
module.exports = homeController;