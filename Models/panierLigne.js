const conn = require('../config/connection');
const Produit = require('./produit');
class Panierligne {
    produit;
    constructor(id,
        qte,
        datetimes,
        produit,

    ) {
        this.id = id;
        this.qte = qte;
        this.datetimes = datetimes;
        this.produit = produit;

    }
    getProduit() {
        return this.produit;
    }
    static deletePanierlignes(id) {
        let sql = "delete from panierlignes where id=?  ";
        let panierlignes = new Promise((resolve, reject) => {
            conn.query(sql, id, async(error, row) => {

                if (!error) {
                    resolve(row)
                } else
                    reject(error);

            });
        });
        return panierlignes;
    }
   addPanierligne(panierid){
       
        let sql = "insert into panierlignes(produitId,panierId,qte,datetimes) values(?,?,?,?) ";
        let panierlignes = new Promise((resolve, reject) => {
            conn.query(sql, [this.produit,panierid,this.qte,this.datetimes], async(error, row) => {

                if (!error) {
                    resolve(row)
                } else
                    reject(error);

            });
        });
        return panierlignes;
    }
    static getPanierLignesByPanier(id) {
        let sql = "select * from panierlignes where panierID = ? ";

        let panierlignes = new Promise((resolve, reject) => {
                conn.query(sql, id, async(error, panierlignerows) => {
                    let panierlignes = [];
                    if (!error) {
                        for (let panierlignerow of panierlignerows)
                            panierlignes.push(new Panierligne(panierlignerow.id, panierlignerow.qte,
                                panierlignerow.datetimes,
                                await Produit.getProduit(panierlignerow.produitId)));

                        resolve(panierlignes);

                    } else
                        reject(error)

                });
            }

        );
        return panierlignes;
    }
    static getPanierLigne(id) {
        let sql = "select * from panierlignes c where c.id=?  ";
        let panierligne = new Promise((resolve, reject) => {
            conn.query(sql, id, (error, panierlignerow) => {;
                if (!panierlignerow)
                    resolve(null)
                else if (!error) {
                    let panierlignerow = panierlignerow[0];
                    resolve(new Panierligne(panierlignerow.id, panierlignerow.qte,
                        panierlignerow.datetimes,
                        Produit.getProduit(panierlignerow.produitId)
                    ));
                } else
                    reject(error);

            });
        });
        return panierligne;

    }
}
module.exports = Panierligne;