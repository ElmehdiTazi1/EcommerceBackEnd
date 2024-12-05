const conn = require('../config/connection');
const User = require("./user");
const Produit = require("./produit");
const Role = require("./role");
class Fournisseur extends User {
    constructor(id, nom,
        prenom, adresse,
        datenaissance,
        telephone, password, mail, role) {
        super(id, nom,
            prenom, adresse,
            datenaissance,
            telephone, password, mail, role);

    }
    getMyVentes() {

        Commande.getCommandesByFournisseurId(this.id);
    }
    static getFournisseur(key) {
        const Fournisseur = require("./fournisseur");
        
        let sql = "select * from users  where (id=? or mail=?) ";
        let fournisseur = new Promise((resolve, reject) => {

            conn.query(sql, [key, key], async(error, fournisseurrow) => {;

                if (!error) {
                      console.log("ss")
                    if (!fournisseurrow.length) {
                        reject("password ou mail incorrecte");
                       return;
                    }

                    
                    fournisseur = fournisseurrow[0];
                    
                    resolve(new Fournisseur(fournisseur.id, fournisseur.nom, fournisseur.prenom, fournisseur.adresse,
                        fournisseur.datenaissance, fournisseur.telephone, fournisseur.password, fournisseur.mail, await Role.getRole(fournisseur.roleId)));
                } else
                    reject(error);

            });
        });


        return fournisseur;
    }
    getMyRevenuThisDay(){
        let sql = "SELECT  SUM(p.prix*qte) as totalrevenu FROM commandes c,produits p where c.produitId=p.id and p.fournisseurId=?  and  DATE(datetimes) = CURDATE();";
        let revenu = new Promise((resolve, reject) => {
            
            conn.query(sql, [this.id], (error,row) => {
                
                if (!error)
                resolve(row[0].totalrevenu)
                else
                    reject(error);

            });
        });
        return revenu;
    }
    getMyVentesPerMonthThisYear(){
        let sql = "SELECT  MONTHNAME(datetimes) as date,sum(qte) as sale  FROM commandes c,produits p where c.produitId=p.id and p.fournisseurId=?   and   YEAR(datetimes) = YEAR(CURDATE()) group by MONTHNAME(datetimes);";
        let ventes = new Promise((resolve, reject) => {
            
            conn.query(sql, [this.id], (error,rows) => {
                
                if (!error){
                    let dates=[];
                  
                    for(let row of rows )
                    dates.push({sales:row.sale,date: row.date});
                    console.log(dates)
                    resolve(dates)
                }
                else
                    reject(error);

            });
        });
        return ventes;
    }
    getMyVentesThisYear(){
        let sql = "SELECT   DATE_FORMAT(datetimes, '%d/%m/%Y')as date,sum(qte) as sale  FROM commandes c,produits p where c.produitId=p.id and p.fournisseurId=?   and   YEAR(datetimes) = YEAR(CURDATE()) group by date(datetimes);";
        let ventes = new Promise((resolve, reject) => {
            
            conn.query(sql, [this.id], (error,rows) => {
                
                if (!error){
                    let dates=[];
                  
                    for(let row of rows )
                    dates.push({sales:row.sale,date: row.date});
                    console.log(dates)
                    resolve(dates)
                }
                else
                    reject(error);

            });
        });
        return ventes;
    }
    getMyRevenuThisMonth(){
        let sql = "SELECT  SUM(p.prix*qte) as totalrevenu FROM commandes c,produits p where c.produitId=p.id and p.fournisseurId=?  and  MONTH(datetimes) = MONTH(CURRENT_DATE()) AND YEAR(datetimes) = YEAR(CURRENT_DATE());";
        
        let revenu = new Promise((resolve, reject) => {
             
             console.log(3)
            conn.query(sql, [this.id], (error,row) => {
            
                if (!error)
                resolve(row[0].totalrevenu)
                else
                    reject(error);

            });
        });
        return revenu;
    }
    getMyRevenuMoyenneThisMonth(){
        let sql = "SELECT  AVG(p.prix*qte) as avgrevenu FROM commandes c,produits p where c.produitId=p.id and p.fournisseurId=?  and  MONTH(datetimes) = MONTH(CURRENT_DATE()) AND YEAR(datetimes) = YEAR(CURRENT_DATE());";
        
        let revenu = new Promise((resolve, reject) => {
             
             console.log(3)
            conn.query(sql, [this.id], (error,row) => {
            
                if (!error)
                resolve(row[0].avgrevenu)
                else
                    reject(error);

            });
        });
        return revenu;
    }
    getMyRevenuThisYear(){
        let sql = "SELECT  SUM(p.prix*qte) as totalrevenu FROM commandes c,produits p where c.produitId=p.id and p.fournisseurId=?  and   YEAR(c.datetimes) = YEAR(CURRENT_DATE())";
        let revenu = new Promise((resolve, reject) => {
           
            conn.query(sql, [this.id], (error,row) => {
                
                console.log(1)
                if (!error)
                    resolve(row[0].totalrevenu);
                else
                    reject(error);

            });
        });
        return revenu;
    }
     getMyTheMostFavorableProduit() {
        
        console.log(4)
        let sql = "select p.id,count(p.id) as countfav from favoris as f,produits as p where f.produitId =p.id and p.fournisseurId=? group by p.id    limit 4";
        let produit = new Promise((resolve, reject) => {
            conn.query(sql, [this.id], async(error, idrows) => {
                if (!idrows.length)
                    resolve()
                else if (!error) {
                    let produits =[]
                   for(let idrow of idrows)  {
                   let produit=await Produit.getProduit(idrow.id);
                   produit.count=idrow.countfav;
                    produits.push(produit)
                   }
                    resolve(produits)
                    
                } else
                    reject(error);

            });
        });
        return produit;
    }
    
    getMyTheMostSaledProduit() {
        
        console.log(4)
        let sql = "select p.id,sum(c.qte) as countsal from commandes as c,produits as p where c.produitId =p.id and p.fournisseurId=? group by p.id order by countsal desc limit 4";
        let produit = new Promise((resolve, reject) => {
            conn.query(sql, [this.id], async(error, idrows) => {
                if (!idrows.length)
                    resolve()
                else if (!error) {
                    let produits =[]
                   for(let idrow of idrows)  {
                   let produit=await Produit.getProduit(idrow.id);
                   produit.count=idrow.countsal;
                    produits.push(produit)
                   }
                    resolve(produits)
                    
                } else
                    reject(error);

            });
        });
        return produit;
    }
    

    getMyCommande() {

        Commande.getCommandesByFournisseur(this.id);
    }
    getMyProduits() {
        return Produit.getProduitsByFournisseur(this.id);
    }
    addProduit(produit) {

        let sql = "insert into produits(titre,stock ,description,fournisseurId,prix) values(?,?,?,?,?) ";
        let produitpro = new Promise((resolve, reject) => {
            let fournisseurs = [];
            conn.query(sql, produit.titre, produit.stock, produit.description, this.id, produit.produit, (error) => {

                if (!error)
                    resolve();
                else
                    reject(error);

            });
        });
        return produitpro;
    };
    deleteMyProduit(id) {
        let sql = "delete from produits where id=? and fournisseurId=? ";
        let produit = new Promise((resolve, reject) => {
         
            conn.query(sql,[id ,this.id], (error) => {

                if (!error)
                    resolve();
                else
                    reject(error);

            });
        });
        return produit;
    }
    modifierProduit() {

    };

    

}
module.exports = Fournisseur;