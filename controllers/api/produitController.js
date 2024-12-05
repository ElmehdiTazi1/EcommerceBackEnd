const Produit = require("../../models/produit");
const Favoris = require("../../models/favoris");
const Admin = require("../../models/admin");

class produitController {

    static index(req, res) {

        Produit.getAllProduits().then( async (produits) => 
        {
            let pro=[]
            
          for(let i in produits){
           pro.push(new Promise(async (reso,err)=>{
            produits[i].isfavoris= await produits[i].isProduitFavorisByClientID(req.user.userId)
            reso();
           })  );      
          }
        Promise.all(pro).then( (reso)=> {
          
            res.status(200).json(produits);
        })
           

        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });

    }
    static show(req, res) {

            Produit.getProduit(req.params.id).then((produits) => {
                res.status(200).json(produits);

            }).catch((err) => {
                res.status(400).send("bad request : " + err);
            });


        }
        static reachBykey(req, res) {

            Produit.getProduitsByKey(req.params.key).then( async (produits) => 
            {
                
              for(let i in produits){
            
                produits[i].isfavoris="";
                produits[i].isfavoris= await produits[i].isProduitFavorisByClientID(req.user.userId)
                
                    
              }
              
                  
                res.status(200).json(produits);
    
            }).catch((err) => {
                res.status(400).send("bad request : " + err);
            });
    
        }
        static reachByCategorie(req, res) {

            Produit.getProduitsByCategorie(req.params.categorie).then( async (produits) => 
            {
                
              for(let i in produits){
            
                produits[i].isfavoris="";
                produits[i].isfavoris= await produits[i].isProduitFavorisByClientID(req.user.userId)
                
                    
              }
              
                  
                res.status(200).json(produits);
    
            }).catch((err) => {
                res.status(400).send("bad request : " + err);
            });
    
        }
      
        /*static (req, res) {

            produit.getproduit(req.params.id).then((produits) => {
                res.status(200).json(produits);

            }).catch((err) => {
                res.status(400).send("bad request : " + err);
            });

        }*/





}
module.exports = produitController;