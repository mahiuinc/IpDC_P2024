const router = require('express').Router();
const controller = require('./worksDone.controller');
const authenticateNotIdParam = require('../farmers/farmers.controller').authenticateNotIdParam;

/**
 * @swagger
 *   /worksDone:
 *     get:
 *       tags:
 *       - WorksDone
 *       description: Get all worksDone
 *       responses:
 *         200:
 *           description: Array with a list of worksDone
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/', controller.getAll);

/**
 * @swagger
 *   /worksDone/o:
 *     get:
 *       tags:
 *       - WorksDone
 *       description: Get all worksDone of your crop
 *       parameters:
 *       - in: header
 *         name: token
 *         description: Token of the owner
 *       responses:
 *         200:
 *           description: Array with a list of worksDone
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
 router.get('/o', authenticateNotIdParam, controller.getAllO);

 /**
 * @swagger
 *   /worksDone/w:
 *     get:
 *       tags:
 *       - WorksDone
 *       description: Get all worksDone visible as a worker
 *       parameters:
 *       - in: header
 *         name: token
 *         description: Token of the Worker
 *       responses:
 *         200:
 *           description: Array with a list of worksDone
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/w', authenticateNotIdParam, controller.getAllW);

/**
 * @swagger
 *      /worksDone/{id}:
 *              get:
 *                      tags:
 *                      - WorksDone
 *                      description: Get a workDone by ID
 *                      parameters:
 *                              - in: path
 *                                name: id
 *                                required: true
 *                                description: The workDone's unique ID
 *                      responses:
 *                              200:
 *                                      description: An object with a single workDone's data
 *                              400:
 *                                      description: Error 400 Bad Request
 *                              500:
 *                                      description: Error 500 Internal Server Error
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 *   /worksDone:
 *     post:
 *       tags:
 *       - WorksDone
 *       description: Create a new workDone
 *       parameters:
 *         - in: body
 *           name: WorkDone
 *           required: true
 *           description: workDone data
 *         - in: header
 *           name: Token
 *           description: Token of the owner
 *         - in: header
 *           name: Crop id
 *           description: workDone's crop id
 *       responses:
 *         200:
 *           description: A object with added workDone
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
 *   /worksDone/{id}:
 *     put:
 *       tags:
 *       - WorksDone
 *       description: Update a workDone by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The workDone's unique ID
 *       responses:
 *         200:
 *           description: A object with updated workDone
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.put('/:id', controller.update);

/**
 * @swagger
 *   /worksDone/{id}:
 *     delete:
 *       tags:
 *       - WorksDone
 *       description: Delete a workDone by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The workDone's unique ID
 *       responses:
 *         200:
 *           description: A object with removed workDone
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.delete('/:id', controller.delete);

module.exports = router;
