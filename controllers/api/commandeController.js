const Commande = require("../../models/commande");
const Admin = require("../../models/admin");

class commandeController {

    static index(req, res) {

        Admin.getAllCommandes().then((commandes) => {
            res.status(200).send(commandes);

        }).catch((err) => {
            res.status(400).json("bad request : " + err);
        });

    }
    static show(req, res) {

        Commande.getCommande(req.params.id).then((commande) => {
            res.status(200).json(commande);

        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });


    }





}
module.exports = commandeController;