const Fournisseur = require("../../models/fournisseur");
const Admin = require("../../models/admin");
const Role = require("../../models/role");
const Produit = require("../../models/produit");
const jwt = require("jsonwebtoken")
class loginController {

    static async index(req, res) {
           res.status(200).render('login');
    }
    
    static async login(req, res) {
       
        
        Fournisseur.getFournisseur(req.body.email).then((fournisseur) => {
            if (req.body.password == fournisseur.password) {
                const token = jwt.sign({ userId: fournisseur.id,password:fournisseur.password,username:fournisseur.nom+" "+fournisseur.prenom, email: fournisseur.mail, role: fournisseur.roleId },
                    process.env.TOKEN_KEY
                );
               
                res.cookie("token", token);
                res.redirect('/')
            } else
                res.status(403).send("password ou mail invalid");
        }).catch((error) => {
            res.status(403).send(error);
        });

    }
    static async logout(req, res) {
        res.clearCookie('token');
        res.redirect('/login')
    }
    

}
module.exports = loginController;