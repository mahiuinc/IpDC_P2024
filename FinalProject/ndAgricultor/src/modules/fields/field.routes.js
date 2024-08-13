const router = require('express').Router();
const controller = require('./fields.controller');
const authenticateNotIdParam = require('../farmers/farmers.controller').authenticateNotIdParam;
/**
 * @swagger
 *   /fields:
 *     get:
 *       tags:
 *       - Fields
 *       description: Get all fields
 *       responses:
 *         200:
 *           description: Array with a list of fields
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/', controller.getAll);

/**
 * @swagger
 *   /fields/o:
 *     get:
 *       tags:
 *       - Fields
 *       description: Get all your fields
 *       parameters:
 *       - in: header
 *         name: token
 *         description: Token of the owner
 *         required: true
 *       responses:
 *         200:
 *           description: Array with a list of fields
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/o', authenticateNotIdParam, controller.getAllO);

/**
 * @swagger
 *   /fields/w:
 *     get:
 *       tags:
 *       - Fields
 *       description: Get all the fields where you work
 *       parameters:
 *       - in: header
 *         name: token
 *         description: Token of the Worker
 *         required: true
 *       responses:
 *         200:
 *           description: Array with a list of fields
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.get('/w', authenticateNotIdParam, controller.getAllW);

/**
 * @swagger
 *      /fields/{id}:
 *              get:
 *                      tags:
 *                      - Fields
 *                      description: Get a field by ID
 *                      parameters:
 *                              - in: path
 *                                name: id
 *                                required: true
 *                                description: The field's unique ID
 *                      responses:
 *                              200:
 *                                      description: An object with a single field's data
 *                              400:
 *                                      description: Error 400 Bad Request
 *                              500:
 *                                      description: Error 500 Internal Server Error
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 *   /fields:
 *     post:
 *       tags:
 *       - Fields
 *       description: Create a new field
 *       parameters:
 *       - in: header
 *         name: token
 *         description: Token of the owner
 *         required: true
 *       - in: body
 *         name: body
 *         description: The field's data
 *       responses:
 *         200:
 *           description: A object with added field
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
 *   /fields/{id}:
 *     put:
 *       tags:
 *       - Fields
 *       description: Update a field by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The field's unique ID
 *       responses:
 *         200:
 *           description: A object with updated field
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.put('/:id', controller.update);

/**
 * @swagger
 *   /fields/{id}:
 *     delete:
 *       tags:
 *       - Fields
 *       description: Delete a field by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The field's unique ID
 *       responses:
 *         200:
 *           description: A object with removed field
 *         400:
 *           description: Error 400 Bad Request
 *         500:
 *           description: Error 500 Internal Server Error
 */
router.delete('/:id', controller.delete);

module.exports = router;