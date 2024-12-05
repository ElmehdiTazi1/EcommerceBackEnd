const conn = require('../config/connection');
const User = require("./user");
const Commande = require('./commande');
const Favoris = require('./favoris');
const Panier = require('./panier');
const Produit = require('./produit');
const Role = require('./role');
class Client extends User {
    constructor(id, nom,
        prenom, adresse,
        datenaissance,
        telephone, password, mail, role, panier) {
        super(id, nom,
            prenom, adresse,
            datenaissance,
            telephone, password, mail, role);

    }
    static getClient(key) {
        const Client = require("./client");
        let role = "client";
        let sql = "select * from users  where (id=? or mail=?) and roleId = 3 ";
        let client = new Promise((resolve, reject) => {

            conn.query(sql, [key, key], async(error, clientrow) => {;

                if (!error) {

                    if (!clientrow.length) {
                        resolve("password ou mail incorrecte");
                        return;
                    }


                    client = clientrow[0];
                    resolve(new Client(client.id, client.nom, client.prenom, client.adresse,
                        client.datenaissance, client.telephone, client.password, client.mail, await Role.getRole(client.roleId)));
                } else
                    reject(error);

            });
        });


        return client;
    }
    getMyCommandes() {

        return Commande.getCommandesByClient(this.id);

    }
    getMyFavoris() {

        return Favoris.getFavorisByClientId(this.id);
    }
    getMyPanier() {
        return Panier.getPanierByClientId(this.id);
    }
    async addToMyPanier(panierlign) {
         await  this.getMyPanier().then((panier)=>{
           return panier.addToPanier(panierlign);
           })
    }
    addToMyFavoris(produitId) {

        let datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let sql = "insert into favoris(clientId,produitId,datetimes) values(?,?,?)";
        let addfavoris = new Promise(async(resolve, reject) => {

            await conn.query(sql, [this.id, produitId, datetime], (err, resultat) => {
                if (err)
                    reject(err);
                resolve(resultat);
            })
        })
        return addfavoris;
    }

    deleteFromMyFavoris(id) {
        return Favoris. deleteFavorisClientByProduitId(this.id,id);
    }
    deleteFromMyPanier(id) {
        return Panier.deleteFromPanier(id)
    }

    async passCommande(commande) {
    commande.insertCommande(this.id);

    
    }


}
module.exports = Client;