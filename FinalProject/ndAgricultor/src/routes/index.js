const router = require('express').Router();

const authenticateNotIdParam = require('./../modules/farmers/farmers.controller').authenticateNotIdParam

const cropRoutes = require('../modules/crops/crop.routes');
const farmerRoutes = require('../modules/farmers/farmer.routes');
const fieldRoutes = require('../modules/fields/field.routes');
const workDoneRoutes = require('../modules/worksDone/workDone.routes');
const maquilaRequestRoutes = require('../modules/maquilaRequests/maquilaRequest.routes')



router.use('/crops', cropRoutes);
router.use('/farmers', farmerRoutes);
router.use('/fields', fieldRoutes);
router.use('/worksDones', workDoneRoutes);
router.use('/maquilaRequests', maquilaRequestRoutes);




router.put('/login', require('./../modules/farmers/farmers.controller').login);
router.put('/login/google', require('./../modules/farmers/farmers.controller').googleLogin);
router.put('/logout', authenticateNotIdParam, require('./../modules/farmers/farmers.controller').logout);

module.exports = router;