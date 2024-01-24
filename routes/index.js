var express = require('express');
var router = express.Router();
const homeController = require("../controllers/home.controller")
/* GET home page. */
router.get('/', homeController.index);
router.get('/send-mail', homeController.sendMail);
router.post('/send-mail', homeController.handleSendMail);
router.get('/detail/:id', homeController.detailSendmail);
router.get('/sendFile/:id', homeController.sendFile);
module.exports = router;
