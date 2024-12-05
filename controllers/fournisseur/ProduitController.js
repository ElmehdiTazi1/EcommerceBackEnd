const Produit = require("../../models/produit");
const Admin = require("../../models/admin");
const Media = require("../../models/media");
const Typemedia = require("../../models/typemedia");
const Categorie = require("../../models/categorie");
const fs = require('fs');
var multer = require('multer');
const sharp = require('sharp');
const Fournisseur = require("../../models/fournisseur");

const dirname = "./public/uploads";
var storage = multer.diskStorage({
    destination: function(req, file, callback) {

        callback(null, dirname);

    },
    filename: function(req, file, callback) {

        if (req.body.titre == "")
            callback("titre doit etre no vide")
        else if (req.body.description == "")
            callback("description doit etre no vide")
        else if (req.body.stock == "")
            callback("stock doit etre no vide")
        else if (req.body.prix == "")
            callback("prix doit etre no vide")
        else {


            req.pathmedia[file.fieldname].push("/" + req.user.username + "-" + req.body.titre + "-" + Math.floor(Math.random() * 1000000000000) + "-" + Date.now() + "." + file.mimetype.split("/")[1]);

            callback(null, "/media" + req.pathmedia[file.fieldname][req.pathmedia[file.fieldname].length - 1])
        }

    }
});
var upload = multer({
    storage: storage
}).fields([{
    name: 'background',
    maxCount: 1
}, {
    name: 'media',
    maxCount: 8
}])

class ProduitController {

    static index(req, res) {

        Produit.getProduitsByFournisseur(req.user.userId).then(  (produits) => 
        {
            
        
            res.status(200).render('produit', {
                produits:produits,
                username: req.user.username
            });


        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });
           
       
    }
    static async show(req, res) {
        let categories = await Categorie.getAllCategories();
        Produit.getProduit(req.params.id).then((produit) => {
            res.status(200).render('editproduit', {
                produit: produit,
                username: req.user.username,
                categories: categories
            });

        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });


    }
    static async addProduit(req, res) {
        let categories = await Categorie.getAllCategories();
        res.status(200).render('addproduit', {
            username: req.user.username,
            categories: categories
        });


    }
    static async create(req, res) {

        req.pathmedia = []
        req.pathmedia["background"] = []
        req.pathmedia["media"] = []
        upload(req, res, async function(err) {

            if (!req.body.categories) {
                res.status(400).json("categorie doit etre affecte");
            } else if (err) {
                    
                res.status(400).json(err);


            } else if (!req.files.background) {
                res.status(400).json("background doit etre upload");
            } else {
                var categories = await Categorie.getAllCategories();

                categories = categories.filter((categorie) => {

                   
                    return req.body.categories.includes(categorie.id + "")
                });

                sharp(dirname + "/media" + req.pathmedia["background"][0]).resize(200, 200,{ fit: 'inside'}).jpeg({
                    quality: 100
                }).toFile(dirname +
                    '/avatar' + req.pathmedia["background"][0]);
                let medias = []

                medias.push(new Media(req.pathmedia["background"][0], await Typemedia.getTypemedia(1)))

                req.pathmedia["media"].forEach(async (item) => {

                    medias.push(new Media(item, await Typemedia.getTypemedia(2)))
                })
               
                let pro = new Produit(req.body.titre, req.body.description, req.body.prix, req.body.stock, medias, categories);


                pro.fournisseur = await Fournisseur.getFournisseur(req.user.userId);
                pro.saveProduit().then(() => {
                    pro.getLastAddproduitId(req.user.userId).then((id) => {

                       let  promise = new Promise((resolve, reject) => {
                            Media.insertMediasByProduitId(medias, id).then(()=>{
                              resolve()
                            }).catch((err) => {
                                reject(err)
                            });
                            Categorie.insertCategoriesByProduitId(categories, id).then(()=>{
                              resolve()
                            }).catch((err) => {
                                reject(err)
                            });
                        })
                        promise.then(()=>{
                          console.log(0)
                        }).then(()=>{
                          console.log(1)
                          res.status(200).json("success")
                        }).catch((err)=>{
                          console.log(err)
                          console.log(2)
                          res.status(400).json(err);
                        }).catch((err)=>{
                          console.log(3)
                          res.status(400).json(err);
                        })
                    }).catch((err) => {
                      console.log(4)
                      res.status(400).json(err);
                    })
                }).catch((err) => {
                  console.log(5)
                  res.status(400).json(err);
                });

            }



        });

    }
    static async edit(req, res) {

        req.pathmedia = []
        req.pathmedia["background"] = []
        req.pathmedia["media"] = []
        upload(req, res, async function(err) {

            if (!req.body.categories) {
                res.status(400).json("categorie doit etre affecte");
                return;
            } else if (err) {

                res.status(400).json(err);
                return;

            } else if (req.body.deletedbackground) {
                if (!req.files.background) {
                    res.status(400).json("backround doit etre upload");
                    return;
                }

                var fs = require('fs');
          
            
                let media = await Media.getMedia(req.body.deletedbackground.substr(14))
                var filePath = dirname + req.body.deletedbackground.substr(8);
                if(fs.existsSync(filePath))
                fs.unlinkSync(filePath);
                var filePath = dirname + '/avatar' + req.body.deletedbackground.substr(14);
                if(fs.existsSync(filePath))
                fs.unlinkSync(filePath)

                sharp(dirname + "/media" + req.pathmedia["background"][0]).resize(200, 200,{ fit: 'inside'}).jpeg({
                    quality: 100
                }).toFile(dirname +
                    '/avatar' + req.pathmedia["background"][0]);
                if(media)
                media.updateMedia(req.pathmedia["background"][0])


            }


            if (req.body.deletedmedia) {
                let deleted = [];

                var fs = require('fs');
                req.body.deletedmedia.forEach(async (item) => {
                   
                    var filePath = dirname + item.substr(8);
                    if(fs.existsSync(filePath))
                    fs.unlinkSync(filePath);

                    let media = await Media.getMedia(item.substr(14))

                    media.deleteMedia(req.pathmedia["background"][0])

                });



            }




            let medias = [];

            req.pathmedia["media"].forEach(async (item) => {
                medias.push(new Media(item, await Typemedia.getTypemedia(2)))
                medias[medias.length - 1].insertMedia(req.params.id);
            })
            let pro = new Produit(req.body.titre, req.body.description, req.body.prix, req.body.stock, medias, "", req.params.id);
            pro.updateProduit().then(() => {
                Categorie.deleteCategoriesByProduitId(req.params.id).then(async () => {
                    var categories = await Categorie.getAllCategories()
                    categories = categories.filter((categorie) => {
                        return req.body.categories.includes(categorie.id + "")
                    });
                    Categorie.insertCategoriesByProduitId(categories, req.params.id).then(() => {
                        res.status(200).json("success");
                    })
                }).catch((err) => {
                    res.status(401).json(err);
                })


            }).catch((err) => {
                res.status(401).json(err)
            });




        });

    }

static delete(req, res){
    Fournisseur.getFournisseur(req.user.userId).then((four)=>{
         
                four.deleteMyProduit(req.params.id).then(()=>{

                    res.redirect("/produits");
                }).catch((err)=>{
                    res.status(500).json({err:err})
                })

    }).catch((err)=>{
        res.status(500).json({err:err})
    });
} 


}
module.exports = ProduitController;