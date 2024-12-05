const conn = require('../config/connection');
const Media=require('./media');
const Categorie =require('./categorie');
const Favoris = require('./favoris');
class Produit {
    constructor( titre,
        description,
        prix, stock, media,categories,id=-1) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.prix = prix;
        this.stock = stock;
        this.media = media;
        this.categories=categories;
    
        if(this.media)
        this.media.forEach((item)=>{
            if(item.typemedia.typenom=="background")
            this.background=item.path;
        });
       
    }
   
    static getProduitsByFournisseur(id) {
        let sql = "select * from produits where  fournisseurId=?  ";
        let produits = new Promise((resolve, reject) => {
            conn.query(sql,[ id],  (error, produitrows) => {
                let produits = [];
                if (!error) {
                    for (let produitrow of produitrows)
                    {
                        let pro= new Promise( async(resol, reject) => 
                        {
                            resol(new Produit( produitrow.titre, produitrow.description, produitrow.prix, produitrow.stock,await  Media.getMediasByProduitId(produitrow.id), await Categorie.getCategoriesByProduitId(produitrow.id),produitrow.id))
                        } 
                        );
                       
                        produits.push(pro);
                    }
                       
                             console.log(1)
                        Promise.all(produits).then((result)=>{
                         
                            resolve(result);
                        })
                    
                } else
                    reject(error);

            });
        });
        return produits;
    }
    static getProduit(id) {
        let sql = "select * from produits where id = ? ";
        let produit = new Promise((resolve, reject) => {
            conn.query(sql, [id], async (error, produitrow) => {
                produitrow = produitrow[0];
                if (!error) {
                    resolve(new Produit( produitrow.titre, produitrow.description, produitrow.prix, produitrow.stock, await Media.getMediasByProduitId(produitrow.id),await Categorie.getCategoriesByProduitId(produitrow.id),produitrow.id))
                } else{
                    reject(error);
                }
                  

            });
        });
        return produit;

    }

     getLastAddproduitId(){
        let sql= "select  id  from produits where fournisseurId=? order by id desc limit 1";
        let id= new Promise((resolve, reject) => {conn.query(sql, [this.fournisseur.id
          
        ], (err, res) => {
            if (err)
                reject(err);
               
           resolve(res[0].id)
    
         
        
       
        })})
return id;
    
    }
    saveProduit(){
      
       
        let insert = new Promise(async (resolve, reject) => {

           
           let  sql = "insert into produits(titre,description,prix,stock,fournisseurId) values(?,?,?,?,?);";
            conn.query(sql, [
            this.titre, this.description, this.prix, this.stock,this.fournisseur.id
        ], async (err, resultat) => {
            if (err)
            {
                reject(err);
                
            }
          
                
               
        })

 
           resolve()

        });
        return insert;
    }
    updateProduit() {
        let update = new Promise(async(resolve, reject) => {

           let  sql = "update produits set  titre=?,description=?,prix=?, stock=? where id=?";
           conn.query(sql, [
                this.titre, this.description, this.prix, this.stock, this.id
            ], (err,resultat) => {
                if (err){
                    reject(err);
                    return;
                }
                resolve();
            })


        });
        return update;
    }
    static getAllProduits() {
        let sql = "select * from produits ";
        
        let produits = new Promise((resolve, reject) => {
            conn.query(sql,[ ],  (error, produitrows) => {
                let produits = [];
                if (!error) {
                    for (let produitrow of produitrows)
                    {
                        let pro= new Promise( async(resol, reject) => 
                        {
                            resol(new Produit( produitrow.titre, produitrow.description, produitrow.prix, produitrow.stock,await  Media.getMediasByProduitId(produitrow.id), await Categorie.getCategoriesByProduitId(produitrow.id),produitrow.id))
                        } 
                        );
                       
                        produits.push(pro);
                    }
                       
                             console.log(1)
                        Promise.all(produits).then((result)=>{
                         
                            resolve(result);
                        })
                    
                } else
                    reject(error);

            });
        });
        return produits;
    }
     isProduitFavorisByClientID(clientId){
       return Favoris.getFavorisByProduitAndClientId(clientId,this.id);
    }
    static forYou(clientid){
        let sql = "  select * from produit,categorie, where pc   (select pc.id from produits p,favoris f, produitcategorie pc where f.produitId=p.id  and pc.produitId=p.id and f.clientId=?) ";
        let produits = new Promise((resolve, reject) => {
            conn.query(sql, async (error, produitrows) => {;
                let produits = [];
                if (!error) {
                    for (let produitrow of produitrows)
                        produits.push(new Produit( produitrow.titre, produitrow.description, produitrow.prix, produitrow.stock, await Media.getMediasByProduitId(produitrow.id),await Categorie.getCategoriesByProduitId(produitrow.id),produitrow.id));
                    resolve(produits);
                } else
                    reject(error);

            });
        });
        return produits;
    }
    
    static rechercheProduit(key){
        key="%"+key+"%"
        let update = new Promise(async(resolve, reject) => {

            let  sql = "select * from produits where LOWER(titre) like LOWER(?) or LOWER(description) like LOWER(?))";
            conn.query(sql,[key,key] ,async (error, produitrows) => {;
                let produits = [];
                if (!error) {
                    for (let produitrow of produitrows)
                        produits.push(new Produit( produitrow.titre, produitrow.description, produitrow.prix, produitrow.stock, await Media.getMediasByProduitId(produitrow.id),await Categorie.getCategoriesByProduitId(produitrow.id),produitrow.id));
                    resolve(produits);
                } else
                    reject(error);
             })
 
 
         });
         return update;
    }
    static getProduitsByKey(key){
        key="%"+key+"%"
        let update = new Promise(async(resolve, reject) => {

            let  sql = "select * from produits where titre like ? or description like ?";
            conn.query(sql,[key,key] ,async (error, produitrows) => {;
                let produits = [];
                if (!error) {
                    for (let produitrow of produitrows)
                        produits.push(new Produit( produitrow.titre, produitrow.description, produitrow.prix, produitrow.stock, await Media.getMediasByProduitId(produitrow.id),await Categorie.getCategoriesByProduitId(produitrow.id),produitrow.id));
                    resolve(produits);
                } else
                    reject(error);
             })
 
 
         });
         return update;
    }
    static getProduitsByCategorie(categorie){
        
        let update = new Promise(async(resolve, reject) => {

            let  sql = "select * from produits where id in (select produitId from produitcategories where  categorieId=? )";
            conn.query(sql,[categorie] ,async (error, produitrows) => {;
                let produits = [];
                if (!error) {
                    for (let produitrow of produitrows)
                        produits.push(new Produit( produitrow.titre, produitrow.description, produitrow.prix, produitrow.stock, await Media.getMediasByProduitId(produitrow.id),await Categorie.getCategoriesByProduitId(produitrow.id),produitrow.id));
                    resolve(produits);
                } else
                    reject(error);
             })
 
 
         });
         return update;
    }

}
module.exports = Produit;