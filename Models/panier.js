const conn = require('../config/connection');
const PanierLigne = require('./panierLigne');

class Panier {

    constructor(id, panierlignes) {
        this.id = id;
        this.panierlignes = panierlignes;


    }
    static deleteFromPanier(id) {
       return PanierLigne.deletePanierlignes(id)
    }
    static deleteAllFromPanier(id) {
        let sql = "delete from panierlignes where panierId=? ";
        let panier = new Promise((resolve, reject) => {
            conn.query(sql, [id], async(error, panierrow) => {;

                if (!panierrow.length)
                    resolve([])

                else if (!error) {
                   resolve();

                } else
                    reject(error);

            });
        });

        return panier;
     }
     addToPanier(panierlign) {
        return panierlign.addPanierligne(this.id);
    }
    static getPanierByClientId(id) {
        let sql = "select * from paniers where clientId = ? ";
        let panier = new Promise((resolve, reject) => {
            conn.query(sql, id, async(error, panierrow) => {;

                if (!panierrow.length)
                    resolve([])

                else if (!error) {
                    let panier = new Panier(panierrow[0].id, await PanierLigne.getPanierLignesByPanier(panierrow[0].id))
                    resolve(panier);

                } else
                    reject(error);

            });
        });

        return panier;
    }
    static getPanier(id) {
        let sql = "select * from paniers where id = ? ";
        let panier = new Promise((resolve, reject) => {
            conn.query(sql, id, async(error, panierrow) => {;

                if (!panierrow.length)
                    resolve([])

                else if (!error) {
                    let panier = new Panier(panierrow[0].id, await PanierLigne.getPanierLignesByPanier(panierrow[0].id))
                    resolve(panier);

                } else
                    reject(error);

            });
        });

        return panier;
    }
}
module.exports = Panier;