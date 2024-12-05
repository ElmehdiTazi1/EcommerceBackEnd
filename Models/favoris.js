const conn = require('../config/connection');


class Favoris {

    constructor(id, datetimes, produit) {
        this.id = id;
        this.datetimes = datetimes;
        this.produit = produit;

    };
    static deleteFavorisClientByProduitId(clientId,id) {
        let sql = "delete from favoris where clientId=? and produitId=? ";
        let favoris = new Promise((resolve, reject) => {
            conn.query(sql, [clientId,id], async(error, row) => {

                if (!error) {
                    resolve(row)
                } else
                    reject(error);

            });
        });
        return favoris;
    }
   static getFavorisByProduitAndClientId(clientid,produitid){
    let sql = "select * from favoris  where produitId=? and clientId=?  ";
    let favoris = new Promise((resolve, reject) => {
        conn.query(sql, [produitid,clientid], async(error, favorisrows) => {
            if (!favorisrows.length)
                resolve(false)
            else if (!error) {
                resolve(true)
                
            } else
                reject(error);

        });
    });
    return favoris;
   }
    static getFavorisByClientId(id) {
        const Produit = require('./produit');
        let sql = "select * from favoris  where clientId=?  ";
        let favoris = new Promise((resolve, reject) => {
            conn.query(sql, [id], async(error, favorisrows) => {
                if (!favorisrows.length)
                    resolve([])
                else if (!error) {
                    let favoris =[]
                    console.log(favorisrows)
                   for(let favorisrow of favorisrows)  {
                    favoris.push(new Favoris(favorisrow.id, favorisrow.datetimes,
                        await Produit.getProduit(favorisrow.produitId)));
                   }
                    resolve(favoris)
                    
                } else
                    reject(error);

            });
        });
        return favoris;
    }

    static getFavoris(id) {
        const Produit = require('./produit');
        let sql = "select * from favoris where id=?  ";
        let favoris = new Promise((resolve, reject) => {
            conn.query(sql, [id], async(error, favorisrow) => {;
                if (!favorisrow.length)
                {
                    resolve([]);
                    return;
                }
                   
                favorisrow = favorisrow[0];
                if (!error) {
                    resolve(new Favoris(favorisrow.id, favorisrow.datetimes,
                        await Produit.getProduit(favorisrow.produitId)
                    ));
                } else
                    reject(error);

            });
        });
        return favoris;

    }

}
module.exports = Favoris;