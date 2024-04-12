const Model = require('../../core/model');

class model extends Model {
    constructor() {
        super('crops');
    };
    getCropsByOwner(f) {
        return new Promise((accept, reject) => {
            this.collection.find({
                field: f
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

    getCropsByWoker(w, f) {
        return new Promise((accept, reject) => {
            this.collection.find({
                field: f,
                worker: w
            }).toArray((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let crops = [];
                    result.forEach(element => {
                        crops.push({
                            id: element._id,
                            crop: element.crop,
                            cropType: element.cropType,
                            field: element.field,
                            season: element.season,
                            status: element.status,
                            year: element.year,
                            month: element.month
                        });
                    });
                    accept(crops);
                }
            })
        });

    };
}

module.exports = model; 