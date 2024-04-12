const express = require('express');
const path = require('path');
const Database = require('./src/core/database');
const soquetIo = require('socket.io');

var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')






//VARIABLES DE CONFIGURACIÓN
const dotenv = require('dotenv');
dotenv.config();


// init app
const app = express();
const port = process.env.PORT || 3000;




//middleware para habilitar la consulta del body del request
app.use('/', express.json());


//CORS
const cors = require('cors');
app.use(cors());


//LOAD APP ROUTES
const apiRoutes = require('./src/routes');
app.use('/', apiRoutes);




// //Use route middlewares ***Pendiente
// app.use('/assets', express.static(path.join(__dirname, 'public')));

// //Set main endpoint
// app.get('/', (req, res) => {
//     const indexPath = path.join(__dirname, 'src', 'index.html');
//     res.sendFile(indexPath);
//     // res.send('hola mundo');
// });


//SWAGGER
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {
    ConnectionClosedEvent
} = require('mongodb');
const exp = require('constants');

const swaggerOptions = {
    swaggerDefinition: {
        swagger: "2.0",
        info: {
            title: 'FarmTask API',
            description: 'A live chat web application',
            version: '1.0.0',
            servers: ['http://localhost:' + port]
        }
    },
    apis: ['./src/modules/**/*.routes.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//Connect to database
let server;
let date = Date.now();
console.log("Date = " + date);
Database.connect().then(() => {
    // Listen to port
    server = app.listen(port, () => {
        console.log('App is listening to port ', port);
    });

    const io = soquetIo(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowHeaders: ['token', 'farmer', 'field', 'crop', 'content-type'],
            credentials: true
        }
    });

    io.on('connection', socket => {
        console.log('Alguien se conectó');
        socket.on('newRequest', data => {
            console.log("Nueva solicitud de maquila ", data);

            socket.broadcast.emit('receiveRequest', data);
        });
    })
});


// // multerS3

// var s3 = new aws.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
//     port: process.env.AWS_PORT
// });

// var uploads = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'farmtaskbucket',
//         metadata: function (req, file, cb) {
//             cb(null, {
//                 fieldName: file.fieldname
//             });
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString())
//         }
//     })
// })

// app.post('/upload', uploads.single('archivo'), function (req, res, next) {
//     res.send('Successfully uploaded ' + req.files.length + ' files!')
// })


//multer 
//si existe el archivo de imagen lo retorna
app.use('/assets', express.static(path.join(__dirname, 'public')));


//configuración de como quieres guardar la imagen
const multerOptions  ={
    destination: (req, file, cb)=>{
        //first error callback
        // donde guardar los datos
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {

        const extension = file.originalname.split('.').pop();
        //puede ser el time stamp o el id del usuario
        cb(null,`Farmtask-pic-${new Date().getTime()}`+"." + extension);
        // `${req.body.name}`
    }
};

const extensiones = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];

//filtro parael middelware
//si es true se manda, si es false no 
// const fileFilter = (req, file, cb) => {
   
//     const extension = file.originalname.split('.').pop().toLowerCase();
//     //la bandera decide si pasa o no
//     //podemos decir que si el tamaño del archivo es grande, no se manda
//     const flag = extension.includes(extensiones);
//     // const flag = file.minetype.startsWith('image/');

//     cb(null, flag);

// }


const multerStorage = multer.diskStorage(multerOptions);


//fileFilter : fileFilter  == fileFilter no es necesario ponerlo dos veces si se llama igual
//crear middleware
// const upload = multer({storage: multerStorage, fileFilter});
const upload = multer({storage: multerStorage});


//multer end point
// app.post('/file', upload.array('files'), (req, res) => {
//     res.send("aquí se sube el archivo");
// })

app.post('/file', upload.single('archivo'), (req, res) => {
    console.log('archivo', req.file)
    res.send("aquí se sube el archivo");
})


