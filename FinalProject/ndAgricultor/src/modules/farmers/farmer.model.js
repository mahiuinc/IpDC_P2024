const Model = require('../../core/model');

class model extends Model {
    constructor() {
        super('farmers');
    };

    getFarmerByEmail(m) {
        return new Promise((accept, reject) => {
            this.collection.findOne({email: m}, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    accept(results);
                }
            })          
        });
    };

    getFarmerByUserName(u) {
        return new Promise((accept, reject) => {
            this.collection.findOne({userName: u}, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    accept(results);
                }
            })          
        });
        
    };
}

module.exports = model; 