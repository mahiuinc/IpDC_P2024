const router = require('express').Router();
const controller = require('./maquilaRequests.controller');
const authenticateNotIdParam = require('../farmers/farmers.controller').authenticateNotIdParam;

/**
 * @swagger
 *   /maquilaRequests:
 *     get:
 *       tags:
 *       - MaquilaRequests
 *       description: Get all maquilaRequests
 *       responses:
 *         200:
 *           description: Array with a list of maquilaRequests
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/', controller.getAll);

 /**
  * @swagger
*   /maquilaRequests/o:
*     get:
*       tags:
*       - MaquilaRequests
*       description: Get all the maquilaRequests that have been made to you.
*       parameters:
*       - in: header
*         name: token
*         description: Token of the Worker
*         required: true
*       responses:
*         200:
*           description: Array with a list of maquilaRequests
*         400:
*           description: Error 400 Bad Request
*         500:
*           description: Error 500 Internal Server Error
*/
 router.get('/o', authenticateNotIdParam, controller.getAllO);

/**
 * @swagger
 *   /maquilaRequests/w:
 *     get:
 *       tags:
 *       - MaquilaRequests
 *       description: Get all the maquilaRequests that have been made to you.
 *       parameters:
 *       - in: header
 *         name: token
 *         description: Token of the Worker
 *         required: true
 *       responses:
 *         200:
 *           description: Array with a list of maquilaRequests
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/w', authenticateNotIdParam, controller.getAllW);

/**
 * @swagger
 *      /maquilaRequests/{id}:
 *              get:
 *                      tags:
 *                      - MaquilaRequests
 *                      description: Get a maquilaRequest by ID
 *                      parameters:
 *                      - in: path
 *                        name: id
 *                        required: true
 *                        description: The maquilaRequest's unique ID
 *                      - in: header
 *                        name: token
 *                        description: Token of the owner
 *                        required: true
 *                      responses:
 *                              200:
 *                                      description: An object with a single maquilaRequest's data
 *                              400:
 *                                      description: Error 400 Bad Request
 *                              500:
 *                                      description: Error 500 Internal Server Error
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 *   /maquilaRequests:
 *     post:
 *       tags:
 *       - MaquilaRequests
 *       description: Create a new maquilaRequest
 *       parameters:
 *       - in: header
 *         name: token
 *         description: Token of the owner
 *         required: true
 *       - in: body
 *         name: Worker id
 *         description:  worker id like 'worker'
 *         required: true
 *       responses:
 *         200:
 *           description: A object with added maquilaRequest
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
 *   /maquilaRequests/{id}:
 *     put:
 *       tags:
 *       - MaquilaRequests
 *       description: Update a maquilaRequest by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The maquilaRequest's unique ID
 *       responses:
 *         200:
 *           description: A object with updated maquilaRequest
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.put('/:id', controller.update);

/**
 * @swagger
 *   /maquilaRequests/ans/{id}:
 *     put:
 *       tags:
 *       - MaquilaRequests
 *       description: Update a maquilaRequest by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The maquilaRequest's unique ID
 *         - in: body
 *           name: body status
 *           required: true
 *           description: The maquilaRequest's status
 *         - in: header
 *           name: token
 *           description: Token of the farmer
 *       responses:
 *         200:
 *           description: A object with updated maquilaRequest
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.put('/ans/:id', authenticateNotIdParam, controller.requestAnswer);

// ELIMINADO:
/**
 * @swagger
 *   /maquilaRequests/{id}:
 *     delete:
 *       tags:
 *       - MaquilaRequests
 *       description: Delete a maquilaRequest by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The maquilaRequest's unique ID
 *       responses:
 *         200:
 *           description: A object with removed maquilaRequest
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.delete('/:id', controller.delete);



module.exports = router;