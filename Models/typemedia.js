const conn = require('../config/connection');

class Typemedia {
    constructor( typenom,id=-1) {
        this.typenom = typenom;
        this.id=id;
    }
    static getTypemedia(id) {
        let sql = "select * from typemedias  where id=?  ";
        let typemedia = new Promise((resolve, reject) => {
            conn.query(sql, id, (error, typerow) => {;
                typerow = typerow[0];
              
                if (!error) {
                    resolve(new Typemedia( typerow.typenom,id));
                } else
                
                    reject(error);

            });
        });
        return typemedia;
    }
}
module.exports = Typemedia;