const express = require('express');
const {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
} = require('../controllers/orders');

const router = express.Router();

router.get('/', getOrders);
router.get('/:orderID', getOrder);
router.post('/', createOrder);
router.delete('/:orderID', deleteOrder);

module.exports = router;
