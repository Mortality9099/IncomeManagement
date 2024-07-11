var express = require('express');
var router = express.Router();
const authMiddleWare = require('../middlewares/authentication');
const controller = require('../controllers/categoryController');

router.get('/', authMiddleWare, controller.index);

router.get('/list', authMiddleWare, controller.list);

router.get('/add', authMiddleWare, controller.add_get);

router.post('/add', authMiddleWare, controller.add_post);

router.get('/delete/:id', authMiddleWare, controller.delete);

router.get('/edit/:id', authMiddleWare, controller.edit_get);

router.post('/edit/:id', authMiddleWare, controller.edit_post);

module.exports = router;
