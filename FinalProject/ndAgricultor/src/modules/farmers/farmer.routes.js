const router = require('express').Router();
const controller = require('./farmers.controller');

//falta editar farmers list para que agrege la lista de id en el header

/**
 * @swagger
 *   /farmers:
 *     get:
 *       tags:
 *       - Farmers
 *       description: Get all farmers
 *       responses:
 *         200:
 *           description: Array with a list of farmers
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/', controller.getAll);

/**
 * @swagger
 *   /farmers/list:
 *     get:
 *       tags:
 *       - Farmers
 *       description: Get a list of specific farmers
 *       parameters:
 *       - in: header
 *         name: ArrayList
 *         description: Array with the ids of the farmers
 *         required: true
 *       responses:
 *         200:
 *           description: Array with a list of farmers
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
 router.get('/list', controller.getListId);

/**
 * @swagger
 *      /farmers/{id}:
 *              get:
 *                      tags:
 *                      - Farmers
 *                      description: Get a farmer by ID
 *                      parameters:
 *                              - in: path
 *                                name: id
 *                                required: true
 *                                description: The farmer's unique ID
 *                              - in: header
 *                                name: token
 *                                description: Token of the farmer
 *                                required: true
 *                      responses:
 *                              200:
 *                                      description: An object with a single farmer's data
 *                              400:
 *                                      description: Error 400 Bad Request
 *                              500:
 *                                      description: Error 500 Internal Server Error
 */
router.get('/:id', controller.authenticate, controller.getOne);

/**
 * @swagger
 *   /farmers:
 *     post:
 *       tags:
 *       - Farmers
 *       description: Create a new farmer
 *       parameters:
 *       - in: body
 *         name: body
 *         description: The farmer's data
 *         required: true
 *       requestbody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string   
 *                    example: "Juan"
 *       responses:
 *         200:
 *           description: A object with added farmer
 *         400:
 *           description: Error 400 Bad Request
 *         405:
 *           description: Error 405 Bad Request. Email is already taken
 *         500:
 *           description: Error 500 Internal Server Error
 *       definitions:

 */
router.post('/', controller.create);

// /**
//  * @swagger
//  *   /farmers/{id}:
//  *     put:
//  *       tags:
//  *       - Farmers
//  *       description: Update a farmer by ID
//  *       parameters:
//  *         - in: path
//  *           name: id
//  *           required: true
//  *           description: The farmer's unique ID
//  *       responses:
//  *         200:
//  *           description: A object with updated farmer
//  *         400:
//  *           description: Error 400 Bad Request
//  *         500:
//  *           description: Error 500 Internal Server Error
//  */
// router.put('/:id', controller.authenticate, controller.update);

// /**
//  * @swagger
//  *   /farmers/{id}:
//  *     delete:
//  *       tags:
//  *       - Farmers
//  *       description: Delete a farmer by ID
//  *       parameters:
//  *         - in: path
//  *           name: id
//  *           required: true
//  *           description: The farmer's unique ID
//  *       responses:
//  *         200:
//  *           description: A object with removed farmer
//  *         400:
//  *           description: Error 400 Bad Request
//  *         500:
//  *           description: Error 500 Internal Server Error
//  */
// router.delete('/:id', controller.authenticate, controller.delete);

module.exports = router;