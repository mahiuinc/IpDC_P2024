const Database = require('./database');
const {
    ObjectId
} = require('mongodb');


class Model {
    collection;
    constructor(collectionName) {
        // Set collection
        this.collection = Database.collection(collectionName);
    }

    getAll() {
        return new Promise((accept, reject) => {
            this.collection.find().toArray((err, results) => {
                if (err) {
                    reject(err);
                } else {
                    accept(results);
                }
            });
        });
    };

    getListId(haedaridArray) { //haedaridArray ya como arreglo
        return new Promise((accept, reject) => {
            let OIdArray = [];
            haedaridArray.forEach(element => {
                OIdArray.push(ObjectId(element));
            });
            this.collection.find({
                _id: {
                    $in: OIdArray
                }
            }).toArray((err, results) => {
                if (err) {
                    reject(err);
                } else {
                    accept(results);
                }
            });
        });
    };

    getOne(id) {
        return this.collection.findOne({
            _id: ObjectId(id)
        });
    };

    create(instance) {
        return new Promise((accept, reject) => {
            this.collection.insertOne(instance, (err, results) => {
                if (err) {
                    console.log('Error: ' + err)
                    reject(err);
                } else {
                    console.log('Documento agregado');
                    accept(instance);
                }
            });
        });
    };

    update(query, update) {
        return new Promise((accept, reject) => {
            this.collection.updateOne(query, {
                $set: update
            }, (err, results) => {
                if (err) {
                    console.log('Error: ' + err)
                    reject(err);
                } else {
                    console.log(results);
                    accept(results);
                }
            })
        });
    }

    unset(query, update) {
        return new Promise((accept, reject) => {
            this.collection.updateOne(query, {
                $unset: update
            }, (err, results) => {
                if (err) {
                    console.log('Error: ' + err)
                    reject(err);
                } else {
                    console.log(results);
                    accept(results);
                }
            })
        });
    }

    remove(id) {
        return new Promise((accept, reject) => {
            this.collection.remove({
                _id: ObjectId(id)
            }, true, (err, result) => {
                if (err) {
                    console.log('Error: ' + err)
                    reject(err);
                } else {
                    console.log('Instancia Eliminada:\n', result);
                    accept(result);
                }
            })
        });
    }
}

module.exports = Model;