const conn = require('../config/connection');
const User = require("./user");
const Fournisseur = require("./fournisseur");
const Produit = require("./produit");
const Panier = require("./panier");
const Commande = require("./commande");
const Role = require("./role");

class Admin extends User {
    constructor(id, nom,
        prenom, adresse,
        datenaissance,
        telephone, password, mail, role, panier) {
        super(id, nom,
            prenom, adresse,
            datenaissance,
            telephone, password, mail, role, panier);

    }
    static deleteClient(id) {
        let role = "client";
        let sql = "delete from users where id=? and roleI";



        let clients = new Promise((resolve, reject) => {
            let clients = [];

            conn.query(sql, async(error, clientrows) => {;

                if (!error) {
                    for (let client of clientrows) {



                        clients.push(new User(client.id, client.nom, client.prenom, client.adresse,
                            client.datenaissance, client.telephone,
                            client.password, client.mail, await Role.getRole(client.roleId), await Panier.getPanier(client.panierId)));


                    }

                    resolve(clients);
                } else
                    reject(error);

            });
        });
        return clients;
    }
    static getAllClients() {

        let role = "client";
        let sql = "select * from users  ";



        let clients = new Promise((resolve, reject) => {
            let clients = [];

            conn.query(sql, async(error, clientrows) => {;

                if (!error) {
                    for (let client of clientrows) {



                        clients.push(new User(client.id, client.nom, client.prenom, client.adresse,
                            client.datenaissance, client.telephone,
                            client.password, client.mail, await Role.getRole(client.roleId)));


                    }

                    resolve(clients);
                } else
                    reject(error);

            });
        });
        return clients;
    }
    static getAllAdmins() {
        let sql = "select * from users where role=1 ";
        let admins = new Promise((resolve, reject) => {
            let admins = [];
            conn.query(sql, async(error, clientrows) => {;

                if (!error) {
                    for (let admin of adminrows) {
                        admins.push(new Admin(admin.id, admin.nom, admin.prenom, admin.adresse,
                            admin.datenaissance, admin.telephone,
                            admin.password, admin.mail, await Role.getRole(admin.roleId), await Panier.getPanier(admin.id)));

                    }
                    resolve(admins);
                } else
                    reject(error);

            });
        });
        return clients;
    }
    static getAllfournisseurs() {
        let role = "fournisseur";
        let sql = "select * from users where roleId = 2 ";
        let fournisseurs = new Promise((resolve, reject) => {

            conn.query(sql, [], async(error, fournisseurrows) => {;
                let fournisseurs = [];
                if (!error) {
                    for (let fournisseur of fournisseurrows)
                        fournisseurs.push(
                            new User(fournisseur.id, fournisseur.nom, fournisseur.prenom, fournisseur.adresse,
                                fournisseur.datenaissance, fournisseur.telephone,
                                fournisseur.password, fournisseur.mail, await Role.getRole(fournisseur.roleId)));
                    resolve(fournisseurs);

                } else
                    reject(error);

            });
        });


        return fournisseurs;
    }
   
    static getAllCommandes() {
        let sql = "select * from commandes    ";
        let commandes = new Promise((resolve, reject) => {
            conn.query(sql, [], async(error, commanderows) => {;
                let commandes = [];
                if (!error) {
                    for (let commanderow of commanderows)
                        commandes.push(new Commande(commanderow.id, commanderow.code, commanderow.qte,
                            commanderow.destination,
                            await Produit.getProduit(commanderow.produitId),
                            await User.getClient(commanderow.clientId)));
                    resolve(commandes)
                } else
                    reject(error);

            });
        });
        return commandes;

    }
}
module.exports = Admin;