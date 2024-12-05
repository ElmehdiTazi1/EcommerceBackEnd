class fournisseurAuthorization {
    static fournisseur(req, res, next) {

        if (req.user.role == 2)
            next()
        else
            res.status(401).send("no autorisation fournisseur");



    }
}


module.exports = fournisseurAuthorization.fournisseur;