var express = require('express');
var mongo = require('../mongo');
var router = express.Router();

router.get('/findUser/:userid', mongo.findUser);
router.get('/register/:userid', mongo.registerUser);
router.get('/getAns/:question/:userid', mongo.getAns);
router.post('/submitAns', mongo.submitAns);
router.post('/updateStat', mongo.updateStat);
router.get('/getDist/:question', mongo.getDist);
router.get('/getRank/:question/:answer/:order', mongo.getRank);
router.get('/getOverall', mongo.getOverall);

module.exports = router;