const {
    MongoClient
} = require('mongodb');

//VARIABLES DE CONFIGURACIÓN
const dotenv = require('dotenv');
dotenv.config();

const mongoUrl = process.env.MONGO_URL;

const Database = {
    dbInstance: null,
    connect: () => {
        return new Promise((accept, reject) => {
            MongoClient.connect(mongoUrl, {
                useUnifiedTopology: true
            }, (err, client) => {
                //Error-first callback
                if (err) {
                    console.log('Algo falló', err);
                    reject(err);
                } else {
                    this.dbInstance = client.db("Agricultor");
                    console.log('Connected sucessfully!!');
                    accept(client);
                }
            });
        });
    },
    collection: (name) => {
        return this.dbInstance.collection(name);
    }
};

module.exports = Database;