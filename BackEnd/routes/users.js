var express = require('express');
var router = express.Router();
var userController = require('../controller/users');
const authen = require('../services/authen');




// localhost:3000/users
router.get('/', userController.getAllUsers);

router.post('/', userController.createUser); // Assuming you have a createUser function

router.put('/:id', userController.updateUser); // id + new data

router.patch('/:id', userController.updateUser); // id + partial data

router.delete('/:id', userController.deleteUser);
// localhost:3000/users/:id
router.get('/:id', userController.getUserById);
//login
router.post('/login', userController.login);
//register
router.post('/register', userController.register);
//refresh token
router.post('/refresh-token', userController.refreshToken);
 
module.exports = router;