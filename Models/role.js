const conn = require('../config/connection');
class Role {
    constructor(id, rolename) {
        this.id = id;
        this.rolename = rolename;
    }
    static getRole(id) {
        let sql = "select * from roles  where id=?  ";
        let role = new Promise((resolve, reject) => {
            conn.query(sql, id, (error, rolerow) => {;
                rolerow = rolerow[0];
                if (!error) {
                    resolve(new Role(rolerow.id, rolerow.nom));
                } else
                    reject(error);

            });
        });
        return role;

    }
}
module.exports = Role;