const Model = require('./maquilaRequest.model');
const farmersConstroller = require('../farmers/farmers.controller');
const farmerModel = require('../farmers/farmer.model');
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
                // let maquilaRequests = [];
                // result.forEach(element => {
                //     maquilaRequests.push({
                //         name: element.name,
                //         email: element.email
                //     });
                // });
                // res.send(maquilaRequests);
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
        body = {};
        body.owner = jwt.verify(req.headers.token, ClavePrivada).id;
        body.worker = req.body.worker;
        body.date = Date.now();
        body.status = "waiting";
        if (!body.worker) {
            res.status(401).send("Unspecified worker");
            return;
        }
        const fModel = new farmerModel();
        fModel.getOne(body.worker).then(worker => {
            if (worker) {
                fModel.getOne(body.owner).then(owner => {
                    if (!owner.worker.includes(body.worker)) {
                        const model = new Model();
                        model.getExistingMaquilaRequests(body.owner, body.worker).then(field => {
                            if (field.length) {
                                res.status(401).send("This request is awaiting response");
                                return;
                            } else {
                                model.create(body).then(result => {
                                    console.log(result)
                                    res.status(200).send(result);
                                    farmersConstroller.updateWMR(body.owner, body.worker, true);
                                    return;
                                }).catch(error => {
                                    console.error(error);
                                    res.send(500, error);
                                    return;
                                });
                            }
                        }).catch(error => {
                            console.error(error);
                            res.send(500, error);
                            return;
                        });
                    } else {
                        res.status(401).send("This worker is already in your worker portfolio");
                        return;
                    }
                });
            } else {
                res.status(401).send("This worker does not exist");
                return;
            }
        }).catch(error => {
            console.error(error);
            res.status(500).send(error);
            return;
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

    getAllO: (req, res) => {
        const model = new Model();
        model.getMaquilaRequestsByOwner(jwt.verify(req.headers.token, ClavePrivada).id).then(result => {
            if (result) {
                let req = []
                result.forEach(element => {
                    req.push({
                        id: element._id,
                        owner: element.owner,
                        date: element.date,
                        status: element.status
                    });
                });
                res.send(req)
            } else {
                res.sendStatus(404);
            }
        });
    },

    getAllW: (req, res) => {
        const model = new Model();
        model.getMaquilaRequestsByWoker(jwt.verify(req.headers.token, ClavePrivada).id).then(result => {
            if (result) {
                let req = []
                result.forEach(element => {
                    req.push({
                        id: element._id,
                        owner: element.owner,
                        date: element.date,
                        status: element.status
                    });
                });
                res.send(req)
            } else {
                res.sendStatus(404);
            }
        });
    },

    requestAnswer: (req, res) => {
        r = req.params.id;
        s = req.body.status
        if (s == "accepted" || s == "refused") {
            const model = new Model();
            model.getOne(req.params.id).then(mR => {
                if (!!mR) {
                    if (mR.status == "waiting") {
                        if (mR.worker != jwt.verify(req.headers.token, ClavePrivada).id) {
                            res.status(401).send("The request is not for you");
                            return;
                        } else {
                            farmersConstroller.updateWMR(mR.owner, mR.worker, false);
                            model.update({
                                _id: ObjectId(mR._id)
                            }, {
                                status: s
                            }).then(result => {
                                if (s == "accepted") {
                                    farmersConstroller.updateW(mR.owner, mR.worker, true);
                                    res.status(200).send("Maquilla request accepted");
                                    return
                                } else if (s == "refused") {
                                    res.status(200).send("Maquilla request refused");
                                    return
                                }
                            }).catch(error => {
                                console.error(error);
                                res.send(500, error);
                                return;
                            });
                        }
                    } else {
                        res.status(401).send("Maquila request answered");
                        return;
                    }
                } else {
                    res.status(401).send("Maquila request not found");
                    return;
                }
            }).catch(error => {
                console.error(error);
                res.status(500).send(error);
                return;
            });
        } else {
            res.status(401).send("Status other than accepted or refused");
            return;
        }
    }

}
module.exports = Controller;