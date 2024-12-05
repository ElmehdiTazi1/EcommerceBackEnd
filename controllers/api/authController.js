const Client = require("../../models/client");
const Admin = require("../../models/admin");
const Fournisseur = require("../../models/fournisseur");
class authController {

    static myProduits(req, res) {

        Fournisseur.getFournisseur(req.id).then((fournisseur) => {
            fournisseur.getProduits().then((produits) => {
                res.status(200).send(produits);

            }).catch((err) => {
                res.status(400).send("bad request : " + err);
            });

        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });

    }
    static myCommandes(req, res) {

        Client.getClient(req.id).then((client) => {
            client.getCommandes().then((commandes) => {
                res.status(200).send(commandes);

            }).catch((err) => {
                res.status(400).send("bad request : " + err);
            });

        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });


    }
    static myFavoris(req, res) {

        Client.getClient(req.id).then((client) => {
            client.getfavoris().then((favoris) => {
                res.status(200).send(favoris);

            }).catch((err) => {
                res.status(400).send("bad request : " + err);
            });

        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });

    }
    static myVentes(req, res) {

        Fournisseur.getFournisseur(req.id).then((fournisseur) => {
            fournisseur.getventes().then((ventes) => {
                res.status(200).send(ventes);

            }).catch((err) => {
                res.status(400).send("bad request : " + err);
            });

        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });

    }


}
module.exports = authController;