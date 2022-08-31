const express = require('express');
const router = express.Router();

const {
    home,
    tokenauth,
    stkpush
} = require('../controllers/mpesaControllers');
router.get('/', home);
router.post('/token', tokenauth, stkpush);

module.exports =router;

