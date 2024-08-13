const router = require('express').Router();
const controller = require('./crops.controller');
const authenticateNotIdParam = require('../farmers/farmers.controller').authenticateNotIdParam;


/** 
 * @swagger
 *   /crops:
 *     get:
 *       tags:
 *       - Crops
 *       description: Get all crops
 *       responses:
 *         200:
 *           description: Array with a list of crops
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/', controller.getAll);

/**
 * @swagger
 *   /crops/o:
 *     get:
 *       tags:
 *       - Crops
 *       description: Get all crops of your field
 *       parameters:
 *         - in: header
 *           name: token
 *           description: Token of the owner
 *       responses:
 *         200:
 *           description: Array with a list of crops
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/o', authenticateNotIdParam, controller.getAllO);

/**
 * @swagger
 *   /crops/w:
 *     get:
 *       tags:
 *       - Crops
 *       description: Get all crops of your worked field
 *       parameters:
 *         - in: header
 *           name: token
 *           description: Token of the Worker
 *       responses:
 *         200:
 *           description: Array with a list of crops
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/w', authenticateNotIdParam, controller.getAllW);

/**
 * @swagger
 *      /crops/{id}:
 *              get:
 *                      tags:
 *                      - Crops
 *                      description: Get a crop by ID
 *                      parameters:
 *                              - in: path
 *                                name: id
 *                                required: true
 *                                description: The crop's unique ID
 *                      responses:
 *                              200:
 *                                      description: An object with a single crop's data
 *                              400:
 *                                      description: Error 400 Bad Request
 *                              500:
 *                                      description: Error 500 Internal Server Error
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 *   /crops:
 *     post:
 *       tags:
 *       - Crops
 *       description: Create a new crop
 *       parameters:
 *       - in: header
 *         name: token
 *         description: Token of the owner
 *       - in: header
 *         name: Field id
 *         description: crop's Field id
 *       - in: body
 *         name: body
 *         description: The crop's data
 *       responses:
 *         200:
 *           description: A object with added crop
 *         400:
 *           description: Error 400 Bad Request
 *         405:
 *           description: Error 405 Bad Request. Email is already taken
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.post('/', authenticateNotIdParam, controller.create);

/**
 * @swagger
 *   /crops/w/{id}:
 *     put:
 *       tags:
 *       - Crops
 *       description: Update a workers crop by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The crop's unique ID
 *         - in: header
 *           name: token
 *           description: Token of the owner
 *         - in: body
 *           name: Modification data
 *           description: Worker modification data
 *       responses:
 *         200:
 *           description: A object with updated crop
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.put('/w/:id', authenticateNotIdParam, controller.updateW);

/**
 * @swagger
 *   /crops/{id}:
 *     delete:
 *       tags:
 *       - Crops
 *       description: Delete a crop by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The crop's unique ID
 *       responses:
 *         200:
 *           description: A object with removed crop
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.delete('/:id', controller.delete);

module.exports = router;