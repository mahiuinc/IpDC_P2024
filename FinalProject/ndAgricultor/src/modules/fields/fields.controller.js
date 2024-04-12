const Model = require('./field.model')
const CropModel = require('./../crops/crop.model');
const {
    ObjectId
} = require('mongodb');

let jwt = require('jsonwebtoken');
const ClavePrivada = process.env.CLAVE_PRIVADA;


const Controller = {
    getAll: (req, res) => {
        const model = new Model();
        model.getAll().then(result => {
            if (result) {
                // let fields = [];
                // result.forEach(element => {
                //     fields.push({
                //         name: element.name,
                //         email: element.email
                //     });
                // });
                // res.send(fields);
                res.send(result)
            } else {
                res.sendStatus(404);
            }
        });
    },

    getOne: (req, res) => {
        const model = new Model();
        model.getOne(req.params.id).then(result => {
            if (result) {
                res.send(result);
            } else {
                res.sendStatus(404);
            }
        });
    },

    create: (req, res) => {
        const model = new Model();
        body = req.body
        body.owner = jwt.verify(req.headers.token, ClavePrivada).id;
        body.worker = [];
        body.ownerUserName = jwt.verify(req.headers.token, ClavePrivada).userName;
        model.create(body).then(result => {
            console.log(result)
            res.status(200).send(result);
        }).catch(error => {
            console.error(error);
            res.status(500).send(error);
        });
    },

    update: (req, res) => {
        const model = new Model();
        model.update({
            _id: ObjectId(req.params.id)
        }, req.body).then(result => {
            if (result) {
                res.send(result);
            } else {
                res.sendStatus(404);
            }
        });
    },

    delete: (req, res) => {
        const model = new Model();
        model.remove(req.params.id).then(result => {
            if (result) {
                console.log('Field eliminado: ', result)
                res.send(result);
            } else {
                res.sendStatus(404);
            }
        });
    },

    getAllO: (req, res) => {
        const model = new Model();
        model.getFieldsByOwner(jwt.verify(req.headers.token, ClavePrivada).id).then(result => {
            if (result) {
                // let fields = [];
                // result.forEach(element => {
                //     fields.push({
                //         name: element.name,
                //         email: element.email
                //     });
                // });
                // res.send(fields);
                res.send(result)
            } else {
                res.sendStatus(404);
            }
        });
    },

    getAllW: (req, res) => {
        const model = new Model();
        model.getFieldsByWoker(jwt.verify(req.headers.token, ClavePrivada).id).then(result => {
            if (result) {
                // let fields = [];
                // result.forEach(element => {
                //     fields.push({
                //         name: element.name,
                //         email: element.email
                //     });
                // });
                // res.send(fields);
                res.send(result)
            } else {
                res.sendStatus(404);
            }
        });
    },

    updateW: (f, w, add) => {
        console.log("ya llegó: ", f, w, add)
        const model = new Model();
        model.getOne(f).then(field => {
            console.log(field);
            if (field) {
                var W = field.worker;
                if (add) {
                    if (W.indexOf(w) == -1)
                        W.push(w);
                } else {
                    const cropModel = new CropModel();
                    cropModel.getCropsByWoker(w, f).then(crops => {
                        console.log("ve, lo que encontramos", crops)
                        console.log("y lo que hay actualmente: ", field.worker)
                        console.log("y lo que hay actualmente: ", W);
                        console.log(crops.length == 0)
                        if (crops.length == 0) {
                            let index = W.indexOf(w);
                            W.splice(index, 1);
                        }
                        console.log("y lo que hay actualmente: ", W);

                    })
                }
                model.unset({
                    _id: ObjectId(field._id)
                }, {
                    "worker": w
                }).then(result => {
                    if (result) {
                        console.log("unset ", result)
                        model.update({
                            _id: ObjectId(field._id)
                        }, {
                            "worker": W
                        }).then(result => {
                            console.log("update ", result)
                        });
                    } else {
                        console.log("Error al modificar el work del campo", f);
                    }
                });
            } else {
                res.sendStatus(404);
            }
        });
    }
}
module.exports = Controller;