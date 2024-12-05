const conn = require('../config/connection');
const Typemedia = require('./typemedia');
class Media {
    constructor( path, typmedia,id=-1) {
        this.id = id;
        this.path = path;
        this.typemedia = typmedia;
    }



    deleteMedia (){
        let sql = "delete from medias where  id=?  ";
            let media = new Promise((resolve, reject) => {
                conn.query(sql, [this.id], async(error) => {
          
                    if (!error) {
                        resolve();
                    } else
                        reject(error);
    
                });
            });
            return media;
    }
    insertMedia (id){
        let sql = "insert into medias(pathmedia,typemediaId,produitId) value(?,?,?) ";
            let media = new Promise((resolve, reject) => {
                conn.query(sql, [this.path,this.typemedia.id,id], async(error) => {
          
                    if (!error) {
                        resolve();
                    } else
                        reject(error);
    
                });
            });
            return media;
    }
    
    static insertMediasByProduitId(medias,id){
       let sql="insert into medias(pathmedia,typemediaId,produitId) values "+ medias.map((item)=>{return "('"+item.path+"','"+item.typemedia.id+"','"+id+"')";});
       let media= new Promise((resolve, reject) => {conn.query(sql, [
        
      ], (err, resultat) => {
          if (err)
              reject(err);
        
              else{
                resolve()
              }
          
      })});
      return media;
     }
updateMedia (path){
    let sql = "update medias set pathmedia=? where id=?  ";
        let media = new Promise((resolve, reject) => {
            conn.query(sql, [path,this.id], async(error) => {
      
                if (!error) {
                    resolve();
                } else
                    reject(error);

            });
        });
        return media;
}


    static getMedia(key) {
        let sql = "select * from medias  where id=? or pathmedia=?  ";
        let media = new Promise((resolve, reject) => {
            conn.query(sql, [key,key], async(error, mediarow) => {
                if(mediarow.length==0){
                    resolve(null);
                    return;
                }
                mediarow = mediarow[0];
                if (!error) {
                    resolve(new Media(mediarow.pathmedia, await Typemedia.getTypemedia(mediarow.typemediaId),mediarow.id));
                } else
                    reject(error);

            });
        });
        return media;
    }
    static getMediasByProduitId(id) {
        let sql = "select * from medias  where produitId=?  ";
        let medias = new Promise((resolve, reject) => {
            conn.query(sql, id, async(error, mediarows) => {
                if(mediarows.length==0){
                    resolve(null);
                    return;
                }
                let medias = [];
                if (!error) {

                    for (let  mediarow of mediarows)
                          {
                                                medias.push( new Promise(async (resol,err)=>{   resol( new Media(mediarow.pathmedia, await Typemedia.getTypemedia(mediarow.typemediaId),mediarow.id) )}));

                          }
                   
                   
                    
                    Promise.all(medias).then((result)=>{
                        console.log(3)
                        resolve(result);
                    })

                    
                } else{
                    console.log(error)
                    reject(error);

                }
                   
            });
        });
        return medias;
    }
}
module.exports = Media;