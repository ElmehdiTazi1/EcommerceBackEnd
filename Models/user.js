const conn = require('../config/connection');
const Panier = require('./panier');
const Role = require('./role');
class User {

    constructor(id, nom,
        prenom, adresse,
        datenaissance,
        telephone, password, mail, role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
        this.datenaissance = datenaissance;
        this.mail = mail;
        this.password = password;
        this.telephone = telephone;
        this.role = role;

        let sql = "select * from commandes where userID = ? ";
        /* conn.query(sql, this.id, (error, commandes) => {
             if (!error) {
                 for (let commande of commandes)
                     this.commandes.push(new Commande(commande.id, commande.code, commande.datetimes));

             }

         });*/
        /*  sql = "select * from paniers where userID = ? ";
        conn.query(sql, this.id, (error, panier) => {
            if (!error)
                this.favoris.push(new Panier(panier.id, panier.code, panier.datetimes));



        }); */






    }



   
    
    updateUser() {
        let update = new Promise(async(resolve, reject) => {

            sql = "update user set  nom=?,prenom=?, adresse=?,datenaissance=?,telephone=?, password=?, mail=?,panierId=? where id=?)";
            await conn.query((sql, this.id, this.nom, this.prenom,
                this.adresse, this.datenaissance,
                this.telephone, this.password,
                this.mail,
                this.panier.id, (err, resultat) => {
                    if (err)
                        reject(err);
                    resolve();
                }))


        });
        return update;
    }
    createClient() {
        let sql = "select count(*) as num from users where mail=?";
        let userreg = new Promise(async(resolve, reject) => {
            conn.query(sql, [this.mail], (err, resultat) => {
                if (err)
                    reject(err);

                else if (resultat[0].num)
                    reject("email deja existe");
                else {

                    sql = "insert into users (nom,prenom, adresse,datenaissance,telephone, password, mail, roleId) values(?,?,?,?,?,?,?,?)";
                    conn.query(sql, [this.nom, this.prenom,
                        this.adresse, this.datenaissance,
                        this.telephone, this.password,
                        this.mail, this.role.id

                    ], (err, resultat) => {
                        if (err)
                            reject(err);
                        resolve();
                    });
                }
            });

        });
        return userreg;
    }

}

module.exports = User;