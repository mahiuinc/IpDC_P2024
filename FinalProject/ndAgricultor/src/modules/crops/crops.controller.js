const Model = require('./crop.model')
const FieldModel = require('./../fields/field.model')
const FarmerdModel = require('./../farmers/farmer.model')
const FieldController = require('./../fields/fields.controller')

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
                // let crops = [];
                // result.forEach(element => {
                //     crops.push({
                //         name: element.name,
                //         email: element.email
                //     });
                // });
                // res.send(crops);
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
        body.field = req.headers.field;
        body.worker = [];
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
        const fieldModel = new FieldModel();
        fieldModel.getOne(req.headers.field).then(field => {
            if (field.hasOwnProperty("_id")) {
                if (field.owner && field.owner == jwt.verify(req.headers.token, ClavePrivada).id) {
                    const model = new Model();
                    model.getCropsByOwner(req.headers.field).then(result => {
                        if (result)
                            res.send(result)
                    }).catch(error => {
                        console.error(error);
                        res.status(500).send(error);
                    });
                } else {
                    res.status(400).send("It's not your field");
                    return;
                }
            } else {
                res.status(400).send("This field does not exist");
                return;
            }
        }).catch(error => {
            console.error(error);
            res.status(501).send(error);
        });
    },

    getAllW: (req, res) => {
        const model = new Model();
        model.getCropsByWoker(jwt.verify(req.headers.token, ClavePrivada).id, req.headers.field).then(result => {
            if (result)
                res.send(result)
        }).catch(error => {
            console.error(error);
            res.status(500).send(error);
        });
    },

    updateW: (req, res) => {
        if (!!req.body.worker && req.body.worker != undefined && req.body.s != undefined && !!req.params.id && req.params.id != undefined) {
            const model = new Model();
            model.getOne(req.params.id).then(crop => {
                if (crop.field) {
                    fieldModel = new FieldModel();
                    fieldModel.getOne(crop.field).then(f => {
                        if (f.owner == jwt.verify(req.headers.token, ClavePrivada).id) {
                            const farmerModel = new FarmerdModel();
                            farmerModel.getOne(f.owner).then(farmer => {
                                let w = req.body.worker;
                                if (farmer.worker.includes(w)) {

                                    let W = crop.worker;
                                    if (req.body.s) {
                                        if (W.indexOf(w) == -1)
                                            W.push(w);
                                    } else {
                                        let index = W.indexOf(w);
                                        W.splice(index, 1);
                                    }
                                    model.update({
                                        _id: ObjectId(crop._id)
                                    }, {
                                        "worker": W
                                    }).then(result => {
                                        if (result) {
                                            console.log("voy a llamar a la funcion con los argumentos: ", crop.field, w, req.body.s)
                                            FieldController.updateW(crop.field, w, req.body.s);
                                            res.status(200).send("Upgraded crop workers");
                                        } else {
                                            console.log("Error al modificar el workMR del crop", f);
                                        }
                                    });
                                } else {
                                    res.status(400).send("It's not your worker");
                                    return;
                                }

                            });
                        } else {
                            res.status(400).send("It's not your crop");
                            return;
                        }

                    });
                } else {
                    res.status(400).send("This crop does not exist");
                    return;
                }
            });
        } else {
            res.status(400).send('The worker "worker" and the boolean "s" are required in the body request');
            return;
        }
    }
}
module.exports = Controller;