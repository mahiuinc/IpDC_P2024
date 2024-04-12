const Model = require('../../core/model');

class model extends Model {
    constructor() {
        super('worksDone');
    };

    getWorksDoneByOwner(c) {
        return new Promise((accept, reject) => {
            this.collection.find({
                crop: c
            }).toArray((err, results) => {
                if (err) {
                    reject(err);
                } else {
                    results.forEach(element => {
                        element.id = element._id;
                        delete element._id;
                    });
                    accept(results);
                }
            })
        });
    }

    getWorksDoneByWoker(w, c) {
        return new Promise((accept, reject) => {
            this.collection.find({
                crop: c,
                worker: w
            }).toArray((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    result.forEach(element => {
                        element.id = element._id;
                        delete element._id;
                    });
                    accept(result);
                }
            })
        });

    };

}

module.exports = model;