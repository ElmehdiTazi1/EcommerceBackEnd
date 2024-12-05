const conn = require('../config/connection');
const Produit = require("./produit");

class Commande {
    
    constructor(id, code,qte, destination,produit) {
        console.log(produit)
        this.id = id;
        this.code = code;
        this.qte = qte;
        this.destination = destination;
        this.produit = produit;
       
    }
    getProduit() {
        return this.produit;
    }
    insertCommande(id){
        console.log("ali")
        console.log(this.produit)
        function formatDateForMySQL(datetime) {
            const year = datetime.getFullYear();
            const month = String(datetime.getMonth() + 1).padStart(2, '0');
            const day = String(datetime.getDate()).padStart(2, '0');
            const hours = String(datetime.getHours()).padStart(2, '0');
            const minutes = String(datetime.getMinutes()).padStart(2, '0');
            const seconds = String(datetime.getSeconds()).padStart(2, '0');
          
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          }
        let sql = "insert into commandes(qte,destination,produitId,datetimes,clientId) values (?,?,?,?,?) ";
        let commande = new Promise((resolve, reject) => {
            conn.query(sql, [this.qte,this.destination,this.produit.id,formatDateForMySQL(new Date()),id], async(error, result) => {;
                if (!error) {
                   resolve();
                } else
                    reject(error);

            });
        });
        return commande;
    }
    static getCommandesByClient(id) {
        const Client = require("./client");
        let sql = "select * from commandes where  clientId=?  ";
        let commande = new Promise((resolve, reject) => {
            conn.query(sql,[ id], async(error, commanderows) => {
                let commandes = [];

                if (!error && commanderows  ) {
                    for (let commanderow of commanderows)
                        commandes.push(new Commande(commanderow.id, commanderow.code, commanderow.qte,
                            commanderow.destination,
                            await Produit.getProduit(commanderow.produitId),
                            await Client.getClient(commanderow.clientId)));
                    resolve(commandes || "");
                } else
                    reject(error);

            });
        });
        return commande;

    }
    
    static getCommande(id) {
        const Client = require("./client");
        let sql = "select * from commandes c where c.id=?  ";
        let commande = new Promise((resolve, reject) => {
            conn.query(sql, id, async(error, commanderow) => {;
                commanderow = commanderow[0];
                if (!error) {
                    resolve(new Commande(commanderow.id, commanderow.code, commanderow.qte,
                        commanderow.destination,
                        await Produit.getProduit(commanderow.produitId)
                        ));
                } else
                    reject(error);

            });
        });
        return commande;

    }
    static getCommandesByFournisseurId(id) {
        
        let sql = "select * from commandes c ,produits p where p.fournisseurId=? and p.id=c.produitId   ";
        let commande = new Promise((resolve, reject) => {
            conn.query(sql, [id], async(error, commanderows) => {;
                let commandes = [];
                
                if (!error) {
                    for (let commanderow of commanderows)
                        commandes.push(new Commande(commanderow.id, commanderow.code, commanderow.qte,
                            commanderow.destination,
                            await Produit.getProduit(commanderow.produitId)
                            ));
                    resolve(commandes)
                } else
                    reject(error);

            });
        });
        return commande;
    }
    static deleteCommande() {

    }
}
module.exports = Commande;