const router = require('express').Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const validetorMiddleware = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/',adminController.showHomePage)



module.exports = router;