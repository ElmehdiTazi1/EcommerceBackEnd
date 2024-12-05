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

        if (req.body.code == "")
            callback("code doit etre no vide")
      
        else {


            req.pathmedia="/" + req.body.code + "-" + Math.floor(Math.random() * 1000000000000) + "-" + Date.now() + "." + file.mimetype.split("/")[1];

            callback(null, "/category" + req.pathmedia)
        }

    }
});
var upload = multer({
    storage: storage
}).fields([{
    name: 'category',
    maxCount: 1
}])

class CategorieController {

    static index(req, res) {

        Categorie.getAllCategories().then(  (categories) => 
        {
            
        
            res.status(200).render('categorie', {
                categories:categories,
                username: req.user.username
            });


        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });
           
       
    }
    static async show(req, res) {
        
        Categorie.getCategorie(req.params.id).then((categorie) => {
            console.log(categorie)
            res.status(200).render('editcategorie', {
                categorie: categorie,
                username: req.user.username
            
            });

        }).catch((err) => {
            res.status(400).send("bad request : " + err);
        });


    }
    static async addCategorie(req, res) {
       
        res.status(200).render('addcategorie', {
            username: req.user.username
           
        });


    }
    static async create(req, res) {

        req.pathmedia = []
      
        upload(req, res, async function(err) {
               
            if (err) {
                   
                res.status(500).json(err);
                     console.log(err)
               return
            }  else if (!req.body.code) {
                res.status(500).json("code doit etre upload");
                return
            }
            else if (!req.files.category) {
                res.status(500).json("categoryimage doit etre upload");
                return
            } else {
               

              let  categorie=new Categorie(req.body.code,req.pathmedia) 
                  categorie.insertCategorie();

            }
            res.status(200).json({mes:"created"});

        });
        
    }
    static async edit(req, res) {

        req.pathmedia = []
     
        upload(req, res, async function(err) {
            let  categorie=await Categorie.getCategorie(req.params.id);
           ;
            if (req.body.code) {
                categorie.code=req.body.code
            }
            else{
                res.status(400).json("image doit etre upload");
                return; 
            }

            if (err) {
                   console.log(err)
                res.status(400).json(err);
           return
            }

            else if (req.body.deletedimage) {
                if (!req.files.category) {
                    res.status(400).json("image doit etre upload");
                    return;
                }

                var fs = require('fs');
          
            

                var filePath = dirname + req.body.deletedimage.substr(8);
                console.log(filePath)
                if(fs.existsSync(filePath))
                fs.unlinkSync(filePath);
              
                categorie.image=req.pathmedia
             
              

            }


            categorie.updateCategorie(req.params.id);


            res.status(200).json({mes:"created"});



        });
       
    }

    static delete(req,res)
        {
            Categorie.deleteCategorie(req.params.id).then(()=>{

                res.redirect("/categories")
            })
        }


}
module.exports = CategorieController;