const Model = require('../../core/model');

class model extends Model {
    constructor() {
        super('maquilaRequests');
    };

    getMaquilaRequestsByOwner(o) {
        return new Promise((accept, reject) => {
            this.collection.find({
                owner: o
            }).toArray((err, results) => {
                if (err) {
                    reject(err);
                } else {
                    accept(results);
                }
            })
        });

    };

    getMaquilaRequestsByWoker(w) {
        return new Promise((accept, reject) => {
            this.collection.find({
                worker: w,
                status: "waiting"
            }).toArray((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    accept(result);
                }
            })
        });

    };

    getMaquilaRequestsByOwnerWorker(o, w) {
        return new Promise((accept, reject) => {
            this.collection.find({
                owner: o,
                worker: w
            }).toArray((err, results) => {
                if (err) {
                    reject(err);
                } else {
                    accept(results);
                }
            })
        });

    };

    getExistingMaquilaRequests(o, w) {
        return new Promise((accept, reject) => {
            this.collection.find({
                worker: w,
                owner: o,
                status: "waiting"
            }).toArray((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    accept(result);
                }
            })
        });

    };

}

module.exports = model;