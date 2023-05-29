const router = require('express').Router();
const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const validetorMiddleware = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/login', authMiddleware.oturumAcilmamis, authController.showLoginForm)
router.get('/logout', authMiddleware.oturumAcilmis, authController.logout)



router.post('/login', authMiddleware.oturumAcilmamis, validetorMiddleware.validateLogin(), authController.login)


module.exports = router;