const Model = require('./workDone.model')
const CropModel = require('./../crops/crop.model')
const FieldModel = require('./../fields/field.model')
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
                // let workDones = [];
                // result.forEach(element => {
                //     workDones.push({
                //         name: element.name,
                //         email: element.email
                //     });
                // });
                // res.send(workDones);
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
        body = req.body;
        body.worker = jwt.verify(req.headers.token, ClavePrivada).id;
        body.crop = req.headers.crop;
        body.workerUserName = jwt.verify(req.headers.token, ClavePrivada).userName;
        body.date = Date.now();
        body.file = req.file;
        model.create(req.body).then(result => {
            console.log(result)
            res.status(200).send(result);
        }).catch(error => {
            console.error(error);
            res.send(500, error);
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
                console.log('WorkDone eliminado: ', result)
                res.send(result);
            } else {
                res.sendStatus(404);
            }
        });
    },

    getAllO: (req, res) => { //headers: token, crop
        const cropModel = new CropModel();
        cropModel.getOne(req.headers.crop).then(crop => {
            if (crop.hasOwnProperty("_id")) {
                const fieldModel = new FieldModel();
                fieldModel.getOne(crop.field).then(field => {
                    if (field.owner == jwt.verify(req.headers.token, ClavePrivada).id) {
                        const model = new Model();
                        model.getWorksDoneByOwner(req.headers.crop).then(result => {
                            if (result)
                                res.send(result)
                        }).catch(error => {
                            console.error(error);
                            res.status(500).send(error);
                        });
                    } else {
                        res.status(400).send("It's not your crop");
                        return;
                    }
                }).catch(error => {
                    console.error(error);
                    res.status(501).send(error);
                });
            } else {
                res.status(400).send("This crop does not exist");
                return;
            }
        }).catch(error => {
            console.error(error);
            res.status(501).send(error);
        });
    },

    getAllW: (req, res) => { //headers: token, crop
        const cropModel = new CropModel();
        cropModel.getOne(req.headers.crop).then(crop => {
            if (crop.hasOwnProperty("_id")) {

                if (crop.worker.includes(jwt.verify(req.headers.token, ClavePrivada).id)) {
                    const model = new Model();
                    model.getWorksDoneByWoker(jwt.verify(req.headers.token, ClavePrivada).id, req.headers.crop).then(result => {
                        if (result) 
                        res.send(result)
                    }).catch(error => {
                        console.error(error);
                        res.status(500).send(error);
                    });
                } else {
                    res.status(400).send("You don't work in this crop");
                    return;
                }


            } else {
                res.status(400).send("This crop does not exist");
                return;
            }
        }).catch(error => {
            console.error(error);
            res.status(501).send(error);
        });
    }
}
module.exports = Controller;