const express = require("express");
const urlControl = require('../controllers/urlcontroller');
const Auth = require("../middleware/UserAuth");
const { newConversation, getConversation } = require('../controllers/conversation')
const { newMessage} = require('../controllers/message')
// const { createPrice, verify} = require('../controllers/Subprice');
const router = express.Router();

router
.route('/:code')
.get(urlControl.GetUrl);

router
.route('/conversation')
.post(newConversation);

router
.route('/message')
.post(newMessage);

router
.route('/conversation/:userId')
.get(getConversation);

// router.post('/test', createPrice)
// router.get('/pay/verify', Auth, verify)

module.exports = router;