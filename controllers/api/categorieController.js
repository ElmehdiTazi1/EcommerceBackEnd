const Categorie = require("../../models/categorie");


class categorieController {

    static index(req, res) {

        Categorie.getAllCategories().then((categories) => {
            res.status(200).json(categories);

        }).catch((err) => {
            res.status(400).json("bad request : " + err);
        });

    }
    

     




}
module.exports = categorieController;