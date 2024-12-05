const Fournisseur = require("../../models/fournisseur");
const Admin = require("../../models/admin");
const Role = require("../../models/role");
const Produit = require("../../models/produit");
const jwt = require("jsonwebtoken")
class fournisseurController {

    static async index(req, res) {

        Admin.getAllfournisseurs().then((fournisseurs) => {
            res.status(200).send(fournisseurs);

        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });

    }
    static show(req, res) {

            Fournisseur.getFournisseur(req.params.id).then((fournisseur) => {
                res.status(200).json(fournisseur);

            }).catch((err) => {
                res.status(400).send("bad request : " + err);
            });

        }
        /*static (req, res) {

            fournisseur.getfournisseur(req.params.id).then((fournisseurs) => {
                res.status(200).json(fournisseurs);

            }).catch((err) => {
                res.status(400).send("bad request : " + err);
            });

        }*/
    static showDetail(req, res) {

        Fournisseur.getfournisseur(req.params.id).then(async(fournisseur) => {
            console.log(await fournisseur.getPanier())
            res.status(200).json({
                "fournisseurId": fournisseur.id,
                "commandes": await fournisseur.getCommandes(),
                "panierlignes": "" /* await fournisseur.getPanier().then(async(pan) => { resolve(await pan.getPanierlignes()) })*/ ,
                "favoris": await fournisseur.getFavoris(),
            });

        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });

    }
    static addProduit(req, res) {

        Fournisseur.getFournisseur(req.params.id).then(async(fournisseur) => {

            fournisseur.addToMyFavoris(req.body.produitId).then((resultat) => {
                res.status(201).send(resultat + " created");
            }).catch((err) => { res.status(400).send("bad request : " + err); })


        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });

    }
    static getProduits(req, res) {

        Fournisseur.getFournisseur(req.params.id).then(async(fournisseur) => {

            fournisseur.getMyProduits().then((resultat) => {
                res.status(200).json(resultat);
            }).catch((err) => { res.status(400).send("bad request : " + err); })


        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });

    }
   

   
   
    static async update(req, res) {
        new fournisseur(req.id, req.nom, req.prenom, req.adresse,
            req.datenaissance, req.telephone,
            req.password, req.mail, await Role.getRole(req.roleId)).then(() => {
            res.status(200).send("row updated");
        }).catch((err) => { res.status(200).send("bad request"); })

    

    }
    
    static async login(req, res) {

        Fournisseur.getFournisseur(req.body.mail).then((fournisseur) => {
           
            if (req.body.password == fournisseur.password) {
              
                const token = jwt.sign({ userId: fournisseur.id, email: fournisseur.email, role: fournisseur.roleId },
                    process.env.TOKEN_KEY, {
                        expiresIn: "2h",
                    }
                );
                console.log("ssss")
                fournisseur.token = token;
                fournisseur.password="";
               console.log(fournisseur);
                res.status(200).send(fournisseur);
            } else
                res.status(403).send("password ou email invalide");
        }).catch((error) => {
            res.status(403).send(error);
        });
    }

}
module.exports = fournisseurController;