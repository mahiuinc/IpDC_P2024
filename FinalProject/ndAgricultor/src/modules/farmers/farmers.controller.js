const Model = require('./farmer.model');
const {
    ObjectId
} = require('mongodb');

let jwt = require('jsonwebtoken');
const ClavePrivada = process.env.CLAVE_PRIVADA;

const {
    OAuth2Client
} = require('google-auth-library');
// const { response } = require('express');
const Googleclient = new OAuth2Client(process.env.googleId);

const Controller = {

    getAll: (req, res) => {
        const model = new Model();
        model.getAll().then(result => {
            if (result) {
                let farmers = [];
                result.forEach(element => {
                    farmers.push({
                        id: element._id,
                        name: element.name,
                        userName: element.userName
                    });
                });
                res.send(farmers);
            } else {
                res.sendStatus(404);
            }
        });
    },

    getOne: (req, res) => {
        const model = new Model();
        model.getOne(jwt.verify(req.headers.token, ClavePrivada).id).then(result => {
            if (result.hasOwnProperty("_id")) {
                result.id = result._id;
                delete result._id
                res.send(result);
            } else {
                res.sendStatus(404);
            }
        });
    },

    create: (req, res) => {
        body = req.body;
        body.worker = [];
        body.workerMR = [];
        const model = new Model();
        const error = {
            emailTaken: false,
            userNameTaken: false
        };
        model.getFarmerByEmail(body.email).then(result => {
            if (result) {
                console.log('Email is already taken');
                error.emailTaken = true;
            }
            model.getFarmerByUserName(req.body.userName).then(result => {
                if (result) {
                    console.log('userName is already taken');
                    error.userNameTaken = true;
                }
                if (error.emailTaken || error.userNameTaken) {
                    res.send(400, error) //NÚMERO DE ERROR NEGOCIABLE *********************************************************************************************
                } else {
                    model.create(req.body).then(result => {
                        console.log(result)
                        res.status(200).send(result);
                    }).catch(error => {
                        console.error(error);
                        res.send(500, error);
                    });
                }

            });
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
        model.remove(jwt.verify(req.headers.token, ClavePrivada).id).then(result => {
            if (result) {
                console.log('Farmer eliminado: ', result)
                res.send(result);
            } else {
                res.sendStatus(404);
            }
        });
    },

    login: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        if (email == undefined || password == undefined)
            res.status(400).send('Bad Request. Empty email or password');
        else {
            const model = new Model();
            model.getFarmerByEmail(email).then(farmer => {
                if (farmer && farmer.password == password) {
                    if (farmer.token) {
                        res.status(200).send({
                            "token": farmer.token
                        });
                    } else {
                        const token = jwt.sign({
                            id: farmer._id,
                            userName: farmer.userName
                        }, ClavePrivada);
                        console.log(token);
                        const model = new Model();
                        model.update({
                            "email": email
                        }, {
                            "token": token
                        }).then(result => {
                            if (result) {
                                console.log(result);
                                res.status(200).send({
                                    "token": token
                                });
                            } else {
                                res.send(500);
                            }
                        })
                    }
                } else res.status(400).send('Incorrect email or password');
            })
        }
    },

    authenticate: (req, res, next) => {
        if (!req.headers.token) {
            res.status(401).send("login is required");
            return;
        };
        jwt.verify(req.headers.token, ClavePrivada, (err, payload) => {
            if (err) {
                res.status(401).send("Incorrect token");
                return;
            } else {
                if (payload.id && payload.id == req.params.id) {
                    const model = new Model();
                    model.getOne(payload.id).then(farmer => {
                        if (farmer && farmer.token && farmer.token == req.headers.token) next();
                        else {
                            res.status(401).send("login is required");
                            return
                        }
                    });
                } else {
                    res.status(401).send("Incorrect token");
                    return;
                }
            }
        });
    },

    authenticateNotIdParam: (req, res, next) => {
        if (!req.headers.token) {
            res.status(401).send("login is required");
            return;
        };
        jwt.verify(req.headers.token, ClavePrivada, (err, payload) => {
            if (err) {
                res.status(401).send("Incorrect token");
                return;
            } else {
                if (payload.id) {
                    const model = new Model();
                    model.getOne(payload.id).then(farmer => {
                        if (farmer && farmer.token && farmer.token == req.headers.token) next();
                        else {
                            res.status(401).send("login is required");
                            return
                        }
                    });
                } else {
                    res.status(401).send("Incorrect token");
                    return;
                }
            }
        });
    },

    getListId: (req, res) => {
        if (!!req.headers.idarray && req.headers.idarray != 'undefined') {
            const model = new Model();
            model.getListId(req.headers.idarray.split(",")).then(result => {
                if (result) {
                    let farmers = [];
                    result.forEach(element => {
                        farmers.push({
                            id: element._id,
                            name: element.name,
                            userName: element.userName
                        });
                    });
                    res.send(farmers);
                } else {
                    res.sendStatus(404);
                }
            });
        } else {
            // res.status(400).send("an id array is required in the header like 'idarray'");
            res.send([]);
        }
    },

    logout: (req, res) => {
        let payload = null;
        jwt.verify(req.headers.token, ClavePrivada, (err, decode) => {
            if (err) {
                res.status(405).send("Incorrect token")
                return;
            } else payload = decode;
        });
        const model = new Model();
        model.update({
            "email": payload.email
        }, {
            "token": false
        }).then(result => {
            if (result) {
                console.log('logout');
                res.status(200).send({
                    "token": false
                });
            } else {
                res.send(504);
            }
        })
    },

    googleLogin(req, res) {
        Googleclient.verifyIdToken({ idToken: req.headers.googletoken }).then(response => { //,
            console.log("Respuesa LA VERIFICACIÓN de google: ", response);
            const responseData = response.getPayload();
            const email = responseData.email;
            if (email == undefined)
                res.status(400).send('Bad Google response. Empty email');
            else {
                const model = new Model();
                model.getFarmerByEmail(email).then(farmer => {
                    if (farmer && farmer.hasOwnProperty('_id')) {
                        console.log("pendiente", farmer.token);
                        console.log(!!farmer.token);
                        if (farmer.token) {
                            res.status(200).send({
                                "token": farmer.token
                            });
                        } else {
                            const token = jwt.sign({
                                id: farmer._id,
                                userName: farmer.userName
                            }, ClavePrivada);
                            console.log("SE GENERÓ UN NUEVO TOKEN EN GOOGLE LOGIN ");
                            const model = new Model();
                            model.update({
                                "email": email
                            }, {
                                "token": token
                            }).then(result => {
                                if (result) {
                                    console.log(result);
                                    res.status(200).send({
                                        "token": token
                                    });
                                } else {
                                    res.send(500);
                                }
                            })
                        }
                    } else{
                        console.log('Incorrect google token, this farmer does not exist')
                        res.status(400).send('Incorrect google token, this farmer does not exist');
                    }
                })
            }
        }).catch(err => {
            console.log("ERROR DE LA VERIFICACIÓN CON GOOGLE")
            res.status(500).send(err);
        });
    },

    updateWMR: (o, w, add) => {
        const model = new Model();
        model.getOne(o).then(farmer => {
            if (farmer) {
                let mR = farmer.workerMR;
                if (add) {
                    mR.push(w);
                } else {
                    let index = mR.indexOf(w);
                    mR.splice(index, 1);
                }
                model.update({
                    _id: ObjectId(o)
                }, {
                    "workerMR": mR
                }).then(result => {
                    if (result) {
                        console.log(result);
                    } else {
                        console.log("Error al modificar el workMR del farmer", f);
                    }
                });
            } else {
                res.sendStatus(404);
            }
        });
    },

    updateW: (o, w, add) => {
        const model = new Model();
        model.getOne(o).then(farmer => {
            if (farmer) {
                let W = farmer.worker;
                if (add) {
                    W.push(w);
                } else {
                    let index = W.indexOf(w);
                    W.splice(index, 1);
                }
                model.update({
                    _id: ObjectId(o)
                }, {
                    "worker": W
                }).then(result => {
                    if (result) {
                        console.log(result);
                    } else {
                        console.log("Error al modificar el work de granjero", f);
                    }
                });
            } else {
                res.sendStatus(404);
            }
        });
    }
}

module.exports = Controller;