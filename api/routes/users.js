const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.get('/:userID', getUser);
router.post('/', createUser);
router.put('/:userID', updateUser);
router.delete('/:userID', deleteUser);

module.exports = router
