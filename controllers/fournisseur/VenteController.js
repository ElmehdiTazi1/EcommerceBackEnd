const Produit = require("../../models/produit");
const Commande = require("../../models/commande");
const Admin = require("../../models/admin");

class VenteController {

    static index(req, res) {

        Commande.getCommandesByFournisseurId(req.user.userId).then((produits) => {
          
            res.status(200).render('vente',{produits,username:req.user.username});

        }).catch((err) => {
    
            res.status(400).render('vente', err);
        });

    }
    static show(req, res) {

            Produit.getProduit(req.params.id).then((produits) => {
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
module.exports = VenteController;