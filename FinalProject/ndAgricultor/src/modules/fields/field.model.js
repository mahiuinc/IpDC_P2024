const Model = require('../../core/model');

class model extends Model {
    constructor() {
        super('fields');
    };

    getFieldsByOwner(o) {
        return new Promise((accept, reject) => {
            this.collection.find({
                owner: o
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

    };

    getFieldsByWoker(w) {
        return new Promise((accept, reject) => {
            this.collection.find({
                worker: w
            }).toArray((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let fields = [];
                    result.forEach(element => {
                        fields.push({
                            id: element._id,
                            name: element.name,
                            location: element.location,
                            references: element.references,
                            season: element.season,
                            area: element.area,
                            owner: element.owner,
                            ownerUserName: element.ownerUserName
                        });
                    });
                    accept(fields);
                }
            })
        });

    };

}

module.exports = model;