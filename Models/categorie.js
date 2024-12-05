const conn = require('../config/connection');
class Categorie {
    constructor( code,image,id=-1) {
        this.code = code;
        this.image=image
        this.id=id;
    }
    static getAllCategories() {
        let sql = "select * from categories  ";
        let categories = new Promise((resolve, reject) => {
            conn.query(sql, [], (error, categoriesrow) => {;
                let categories = [];
                if (!error) {
                    for (let categorierow of categoriesrow){
                        categories.push(new Categorie(categorierow.code,categorierow.image,categorierow.id)) 
                    }
                    resolve(categories)
                }
               else
                console.log(error)
                    reject(error);

            });
        });
        return categories;
    }
    static getCategorie(id) {
        let sql = "select * from categories where id=? ";
        let categories = new Promise((resolve, reject) => {
            conn.query(sql, [id], (error, categorierows) => {
                let categorierow = categorierows[0];
                if (!error) {
                  
                    resolve(new Categorie(categorierow.code,categorierow.image,categorierow.id)) 

                    }
                    
                
          
                    reject(error);

            });
        });
        return categories;
    }
    static insertCategoriesByProduitId(categories,id){
       let sql="insert into produitcategories(categorieId,produitId) values "+ categories.map((item)=>{return "('"+item.id+"','"+id+"')";});
       let categorie=new Promise((resolve, reject) => { conn.query(sql, [
          
        ], (err, resultat) => {
            if (err)
                reject(err);
                else
             resolve()   
          
            
        })})
        return categorie;
    }
     insertCategorie(){
        let sql="insert into categories(code,image) values (?,?)" ;
        let categorie=new Promise((resolve, reject) => { conn.query(sql, [
           this.code,this.image
         ], (err, resultat) => {
             if (err)
                 reject(err);
                 else
              resolve()   
           
             
         })})
         return categorie;
     }
     updateCategorie(){
        let sql="update categories set code=?,image=? where id=?" ;
        let categorie=new Promise((resolve, reject) => { conn.query(sql, [
           this.code,this.image,this.id
         ], (err, resultat) => {
             if (err)
                 reject(err);
                 else
              resolve()   
           
             
         })})
         return categorie;
     }
    static deleteCategoriesByProduitId(id){
        let sql="delete from produitcategories where produitId=?";
       let categorie=new Promise((resolve, reject) => { 
        conn.query(sql, [id
          
        ], (err, resultat) => {
            if (err)
                reject(err);
          resolve()
            
        })})
        return categorie
    }
    static deleteCategorie(id){
        let sql="delete from categories where id=?";
       let categorie=new Promise((resolve, reject) => { 
        conn.query(sql, [id
          
        ], (err, resultat) => {
            if (err)
                reject(err);
          resolve()
            
        })})
        return categorie
    }
    static getCategoriesByProduitId(id){
        let sql = "select * from categories where id in (select categorieId from produitcategories where produitId=?  )";
        let categories = new Promise((resolve, reject) => {
            conn.query(sql, [id],async  (error, categoriesrow) => {;
                let categories = [];
                if (!error) {
                    for (let categorierow of categoriesrow){
                        categories.push(   new Promise( (resol,err)=>{resol(new Categorie(categorierow.code,categorierow.image,categorierow.id)) }) )
                    }
                    resolve(await Promise.all(categories))
                }
               else
           
                    reject(error);

            });
        });
        return categories;
    }

}
module.exports = Categorie;